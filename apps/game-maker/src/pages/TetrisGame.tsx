import { useEffect, useRef } from 'react'
import Phaser from 'phaser'

class TetrisScene extends Phaser.Scene {
  private grid: boolean[][]
  private currentPiece: { shape: boolean[][], x: number, y: number }
  private nextPiece: boolean[][]
  private score: number
  private scoreText!: Phaser.GameObjects.Text
  private gameOver: boolean
  private moveTimer: number
  private blockSize: number
  private pieces: boolean[][][] = [
    [ // I
      [true, true, true, true]
    ],
    [ // O
      [true, true],
      [true, true]
    ],
    [ // T
      [true, true, true],
      [false, true, false]
    ],
    [ // L
      [true, false],
      [true, false],
      [true, true]
    ],
    [ // J
      [false, true],
      [false, true],
      [true, true]
    ],
    [ // S
      [false, true, true],
      [true, true, false]
    ],
    [ // Z
      [true, true, false],
      [false, true, true]
    ]
  ]

  constructor() {
    super({ key: 'TetrisScene' })
    this.blockSize = 30
    this.grid = Array(20).fill(null).map(() => Array(10).fill(false))
    this.score = 0
    this.gameOver = false
    this.moveTimer = 0
    this.nextPiece = this.getRandomPiece()
    this.currentPiece = {
      shape: this.getRandomPiece(),
      x: 3,
      y: 0
    }
  }

  create() {
    // 添加分数显示
    this.scoreText = this.add.text(320, 16, '分数: 0', {
      fontSize: '32px',
      color: '#fff'
    })

    // 添加键盘控制
    if (this.input?.keyboard) {
      this.input.keyboard.on('keydown', this.handleKeyDown, this)
    }
  }

  update(time: number) {
    if (this.gameOver) return

    if (this.input?.keyboard && time > this.moveTimer) {
      this.moveDown()
      this.moveTimer = time + 1000 // 每秒下落一格
    }

    this.drawGame()
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (this.gameOver) return

    switch (event.code) {
      case 'ArrowLeft':
        this.moveHorizontal(-1)
        break
      case 'ArrowRight':
        this.moveHorizontal(1)
        break
      case 'ArrowDown':
        this.moveDown()
        break
      case 'ArrowUp':
        this.rotatePiece()
        break
    }
  }

  private moveHorizontal(dx: number) {
    const newX = this.currentPiece.x + dx
    if (this.isValidMove(this.currentPiece.shape, newX, this.currentPiece.y)) {
      this.currentPiece.x = newX
    }
  }

  private moveDown() {
    const newY = this.currentPiece.y + 1
    if (this.isValidMove(this.currentPiece.shape, this.currentPiece.x, newY)) {
      this.currentPiece.y = newY
    } else {
      this.placePiece()
      this.checkLines()
      this.spawnNewPiece()
    }
  }

  private rotatePiece() {
    const rotated = this.currentPiece.shape[0].map((_, i) =>
      this.currentPiece.shape.map(row => row[i]).reverse()
    )
    if (this.isValidMove(rotated, this.currentPiece.x, this.currentPiece.y)) {
      this.currentPiece.shape = rotated
    }
  }

  private isValidMove(shape: boolean[][], x: number, y: number): boolean {
    return shape.every((row, dy) =>
      row.every((cell, dx) => {
        if (!cell) return true
        const newX = x + dx
        const newY = y + dy
        return (
          newX >= 0 &&
          newX < this.grid[0].length &&
          newY >= 0 &&
          newY < this.grid.length &&
          !this.grid[newY][newX]
        )
      })
    )
  }

  private placePiece() {
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const gridY = this.currentPiece.y + y
          const gridX = this.currentPiece.x + x
          if (gridY >= 0) {
            this.grid[gridY][gridX] = true
          }
        }
      })
    })
  }

  private checkLines() {
    for (let y = this.grid.length - 1; y >= 0; y--) {
      if (this.grid[y].every(cell => cell)) {
        this.grid.splice(y, 1)
        this.grid.unshift(Array(10).fill(false))
        this.score += 100
        this.scoreText.setText(`分数: ${this.score}`)
      }
    }
  }

  private spawnNewPiece() {
    this.currentPiece = {
      shape: this.nextPiece,
      x: 3,
      y: 0
    }
    this.nextPiece = this.getRandomPiece()

    if (!this.isValidMove(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y)) {
      this.gameOver = true
      this.add.text(400, 300, '游戏结束', {
        fontSize: '64px',
        color: '#ff0000'
      }).setOrigin(0.5)
    }
  }

  private getRandomPiece(): boolean[][] {
    return [...this.pieces[Math.floor(Math.random() * this.pieces.length)]]
  }

  private drawGame() {
    this.children.removeAll()
    
    // 重新添加分数文本
    this.scoreText = this.add.text(320, 16, `分数: ${this.score}`, {
      fontSize: '32px',
      color: '#fff'
    })

    // 绘制网格
    this.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          this.add.rectangle(
            x * this.blockSize + this.blockSize / 2,
            y * this.blockSize + this.blockSize / 2,
            this.blockSize - 2,
            this.blockSize - 2,
            0x00ff00
          )
        }
      })
    })

    // 绘制当前方块
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          this.add.rectangle(
            (this.currentPiece.x + x) * this.blockSize + this.blockSize / 2,
            (this.currentPiece.y + y) * this.blockSize + this.blockSize / 2,
            this.blockSize - 2,
            this.blockSize - 2,
            0x0000ff
          )
        }
      })
    })
  }
}

export function TetrisGame() {
  const gameRef = useRef<HTMLDivElement>(null)
  const game = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (gameRef.current && !game.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 600,
        height: 800,
        parent: gameRef.current,
        backgroundColor: '#2d2d2d',
        scene: TetrisScene
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
      <h1 className="text-3xl font-bold mb-4">俄罗斯方块</h1>
      <div ref={gameRef} className="border-4 border-gray-300 rounded-lg" />
      <div className="mt-4 text-gray-600">
        使用方向键控制：
        <br />
        ← → 左右移动
        <br />
        ↑ 旋转
        <br />
        ↓ 加速下落
      </div>
    </div>
  )
} 