import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { SnakeGameCore } from '../core/SnakeGameCore'
import { SNAKE_GAME_CONFIG } from '../config/snakeGameConfig'
import { ConfigTree } from '../components/ConfigTree'
import { ChatBoxContainer } from '../containers/ChatBoxContainer'

class SnakeScene extends Phaser.Scene {
  private gameObjects: {
    snake: Phaser.GameObjects.Rectangle[]
    food: Phaser.GameObjects.Rectangle | null
    scoreText: Phaser.GameObjects.Text | null
    comboText: Phaser.GameObjects.Text | null
    speedUpText: Phaser.GameObjects.Text | null
  }
  private gameCore: SnakeGameCore
  private moveTimer: number = 0

  constructor() {
    super({ key: 'SnakeScene' })
    this.gameCore = new SnakeGameCore()
    this.gameObjects = {
      snake: [],
      food: null,
      scoreText: null,
      comboText: null,
      speedUpText: null
    }
  }

  create() {
    const state = this.gameCore.getState()
    const { snakeSize } = SNAKE_GAME_CONFIG.grid
    const { colors } = SNAKE_GAME_CONFIG.visuals
    const { score: scoreStyle, combo: comboStyle, speedUp: speedUpStyle } = SNAKE_GAME_CONFIG.visuals.text
    
    this.gameObjects.snake = state.snake.map(pos => 
      this.add.rectangle(pos.x, pos.y, snakeSize, snakeSize, colors.snake)
    )

    this.gameObjects.food = this.add.rectangle(
      state.food.x,
      state.food.y,
      snakeSize,
      snakeSize,
      colors.food
    )

    this.gameObjects.scoreText = this.add.text(
      scoreStyle.x,
      scoreStyle.y,
      '分数: 0',
      {
        fontSize: scoreStyle.fontSize,
        color: scoreStyle.color
      }
    )

    this.gameObjects.comboText = this.add.text(
      comboStyle.x,
      comboStyle.y,
      '连击: x1',
      {
        fontSize: comboStyle.fontSize,
        color: comboStyle.color
      }
    )
    this.gameObjects.comboText.setVisible(false)

    this.gameObjects.speedUpText = this.add.text(
      speedUpStyle.x,
      speedUpStyle.y,
      '极速模式！',
      {
        fontSize: speedUpStyle.fontSize,
        color: speedUpStyle.color
      }
    )
    this.gameObjects.speedUpText.setOrigin(0.5)
    this.gameObjects.speedUpText.setVisible(false)

    this.input.keyboard.on('keydown', this.handleKeyDown, this)
    this.input.keyboard.on('keydown-SPACE', () => {
      const activated = this.gameCore.activateInvincible()
      if (activated) {
        this.updateVisuals()
      }
    })
  }

  update(time: number) {
    const state = this.gameCore.getState()
    if (this.input?.keyboard && time > this.moveTimer) {
      const result = this.gameCore.moveSnake()
      
      if (result.isGameOver) {
        this.gameOver()
        return
      }

      this.updateVisuals()
      this.moveTimer = time + state.moveInterval

      // 添加移动特效
      if (state.moveInterval < 80) {
        this.addMoveEffect(this.gameObjects.snake[0])
      }

      // 如果发生穿墙，添加特效
      if (result.didTeleport) {
        const oldHead = this.gameObjects.snake[1]
        const newHead = this.gameObjects.snake[0]
        this.addTeleportEffect(oldHead, newHead)
      }

      // 如果发生自动调整，添加特效
      if (result.didAutoAdjust) {
        this.addAutoAdjustEffect(this.gameObjects.snake[0])
      }
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    let newDirection = { x: 0, y: 0 }
    
    switch (event.code) {
      case 'ArrowUp':
        newDirection = { x: 0, y: -1 }
        break
      case 'ArrowDown':
        newDirection = { x: 0, y: 1 }
        break
      case 'ArrowLeft':
        newDirection = { x: -1, y: 0 }
        break
      case 'ArrowRight':
        newDirection = { x: 1, y: 0 }
        break
    }

    if (newDirection.x !== 0 || newDirection.y !== 0) {
      const changed = this.gameCore.setDirection(newDirection)
      if (changed) {
        const result = this.gameCore.moveSnake()
        if (!result.isGameOver) {
          this.updateVisuals()
          this.moveTimer = this.time.now + this.gameCore.getState().moveInterval
        }
      }
    }
  }

  private updateVisuals() {
    const state = this.gameCore.getState()

    // 更新蛇的位置和外观
    while (this.gameObjects.snake.length > state.snake.length) {
      const tail = this.gameObjects.snake.pop()
      tail?.destroy()
    }
    
    while (this.gameObjects.snake.length < state.snake.length) {
      this.gameObjects.snake.push(
        this.add.rectangle(0, 0, 18, 18, 0x00ff00)
      )
    }

    state.snake.forEach((pos, i) => {
      const segment = this.gameObjects.snake[i]
      segment.setPosition(pos.x, pos.y)
      if (state.isInvincible) {
        segment.setFillStyle(Phaser.Display.Color.HSVToRGB(
          (this.time.now / 1000 + i * 0.1) % 1, 1, 1).color)
      } else {
        segment.setFillStyle(0x00ff00)
      }
    })

    // 更新食物位置
    this.gameObjects.food.setPosition(state.food.x, state.food.y)

    // 更新分数显示
    this.gameObjects.scoreText.setText(`分数: ${state.score}`)

    // 更新连击显示
    if (state.combo > 1) {
      this.gameObjects.comboText.setText(`连击: x${state.combo}`)
      this.gameObjects.comboText.setVisible(true)
    } else {
      this.gameObjects.comboText.setVisible(false)
    }

    // 更新速度提示
    const isHighSpeed = state.moveInterval < 80
    this.gameObjects.speedUpText.setVisible(isHighSpeed)
  }

  private addMoveEffect(head: Phaser.GameObjects.Rectangle) {
    const state = this.gameCore.getState()
    const { movement } = SNAKE_GAME_CONFIG.visuals.effects
    const { colors } = SNAKE_GAME_CONFIG.visuals
    
    const effect = this.add.rectangle(head.x, head.y, SNAKE_GAME_CONFIG.grid.snakeSize, SNAKE_GAME_CONFIG.grid.snakeSize, 
      state.isInvincible ? colors.snake : colors.snake)
    effect.setAlpha(movement.initialAlpha)

    const speedRatio = SNAKE_GAME_CONFIG.gameplay.speed.baseInterval / state.moveInterval
    const scaleMultiplier = 1 + (speedRatio - 1) * 0.5

    this.tweens.add({
      targets: effect,
      alpha: 0,
      scale: movement.scale * scaleMultiplier,
      duration: movement.duration,
      ease: 'Power2',
      onComplete: () => {
        effect.destroy()
      }
    })
  }

  private addTeleportEffect(oldHead: Phaser.GameObjects.Rectangle, newHead: Phaser.GameObjects.Rectangle) {
    const { teleport } = SNAKE_GAME_CONFIG.visuals.effects
    const { colors } = SNAKE_GAME_CONFIG.visuals

    const disappearEffect = this.add.circle(oldHead.x, oldHead.y, teleport.size, colors.teleport, teleport.alpha)
    this.tweens.add({
      targets: disappearEffect,
      scale: 0,
      alpha: 0,
      duration: teleport.duration,
      ease: 'Power2',
      onComplete: () => {
        disappearEffect.destroy()
      }
    })

    const appearEffect = this.add.circle(newHead.x, newHead.y, teleport.size, colors.teleport, 0)
    appearEffect.setScale(0)
    this.tweens.add({
      targets: appearEffect,
      scale: 1,
      alpha: teleport.alpha,
      duration: teleport.duration,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: appearEffect,
          alpha: 0,
          duration: teleport.duration,
          ease: 'Power2',
          onComplete: () => {
            appearEffect.destroy()
          }
        })
      }
    })
  }

  private addAutoAdjustEffect(head: Phaser.GameObjects.Rectangle) {
    const { autoAdjust } = SNAKE_GAME_CONFIG.visuals.effects
    const { colors } = SNAKE_GAME_CONFIG.visuals

    const effect = this.add.circle(head.x, head.y, autoAdjust.size, colors.autoAdjust, autoAdjust.alpha)
    
    this.tweens.add({
      targets: effect,
      scale: autoAdjust.scale,
      alpha: 0,
      duration: autoAdjust.duration,
      ease: 'Power2',
      onComplete: () => {
        effect.destroy()
      }
    })
  }

  private gameOver() {
    // 游戏结束特效
    this.add.tween({
      targets: this.gameObjects.snake,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        this.scene.restart()
      }
    })
  }
}

export function SnakeGame() {
  const gameRef = useRef<HTMLDivElement>(null)
  const game = useRef<Phaser.Game | null>(null)
  const [showConfig, setShowConfig] = useState(false)

  useEffect(() => {
    if (gameRef.current && !game.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: SNAKE_GAME_CONFIG.canvas.width,
        height: SNAKE_GAME_CONFIG.canvas.height,
        parent: gameRef.current,
        backgroundColor: SNAKE_GAME_CONFIG.canvas.backgroundColor,
        scene: SnakeScene
      }

      game.current = new Phaser.Game(config)
    }

    return () => {
      game.current?.destroy(true)
      game.current = null
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">超级贪吃蛇</h1>
      <div className="flex gap-8">
        <div>
          <div ref={gameRef} className="border-4 border-gray-300 rounded-lg" />
          <div className="mt-4 space-y-2 text-gray-600">
            <div>使用方向键控制蛇的移动</div>
            <div>空格键激活无敌模式（需要{SNAKE_GAME_CONFIG.gameplay.abilities.invincible.requiredScore}分）</div>
            <div>特殊食物效果：</div>
            <div>🟡 金色 - 加速模式</div>
            <div>🔵 青色 - 双倍分数</div>
            <div>🟣 紫色 - 短暂无敌</div>
          </div>
        </div>
        <div>
          <ChatBoxContainer />
        </div>
      </div>
      
      <div className="mt-8 w-full max-w-2xl">
        <button
          className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          onClick={() => setShowConfig(!showConfig)}
        >
          {showConfig ? '隐藏配置' : '显示配置'}
        </button>
        
        {showConfig && (
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-xl font-bold mb-4">游戏配置</h2>
            <ConfigTree data={SNAKE_GAME_CONFIG} />
          </div>
        )}
      </div>
    </div>
  )
} 