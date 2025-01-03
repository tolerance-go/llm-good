import { SNAKE_GAME_CONFIG } from '../config/snakeGameConfig'

export interface Position {
  x: number
  y: number
}

export interface GameState {
  snake: Position[]
  food: Position
  direction: Position
  score: number
  combo: number
  moveInterval: number
  isInvincible: boolean
  lastFoodTime: number
}

export class SnakeGameCore {
  private state: GameState
  private readonly gridSize: number = SNAKE_GAME_CONFIG.grid.size
  private readonly width: number
  private readonly height: number

  constructor(width: number = SNAKE_GAME_CONFIG.canvas.width, height: number = SNAKE_GAME_CONFIG.canvas.height) {
    this.width = width
    this.height = height
    this.state = {
      snake: SNAKE_GAME_CONFIG.gameplay.initialSnake.map(pos => ({ ...pos })),
      food: { x: 0, y: 0 },
      direction: { x: 0, y: 0 },
      score: 0,
      combo: 0,
      moveInterval: SNAKE_GAME_CONFIG.gameplay.speed.baseInterval,
      isInvincible: false,
      lastFoodTime: 0
    }
    this.placeFood()
  }

  getState(): GameState {
    return {
      ...this.state,
      snake: this.state.snake.map(pos => ({ ...pos })),
      food: { ...this.state.food },
      direction: { ...this.state.direction }
    }
  }

  setState(newState: Partial<GameState>) {
    if (newState.snake) {
      this.state.snake = newState.snake.map(pos => ({ ...pos }))
    }
    if (newState.food) {
      this.state.food = { ...newState.food }
    }
    if (newState.direction) {
      this.state.direction = { ...newState.direction }
    }
    if (newState.score !== undefined) {
      this.state.score = newState.score
    }
    if (newState.combo !== undefined) {
      this.state.combo = newState.combo
    }
    if (newState.moveInterval !== undefined) {
      this.state.moveInterval = newState.moveInterval
    }
    if (newState.isInvincible !== undefined) {
      this.state.isInvincible = newState.isInvincible
    }
    if (newState.lastFoodTime !== undefined) {
      this.state.lastFoodTime = newState.lastFoodTime
    }
  }

  setDirection(newDirection: Position): boolean {
    // 防止反向移动
    if (
      (this.state.direction.x !== 0 && newDirection.x === -this.state.direction.x) ||
      (this.state.direction.y !== 0 && newDirection.y === -this.state.direction.y)
    ) {
      return false
    }

    this.state.direction = { ...newDirection }
    return true
  }

  calculateDistanceToFood(position: Position): number {
    // 计算与食物的最短距离（考虑穿墙）
    const dx = Math.min(
      Math.abs(position.x - this.state.food.x),
      Math.min(
        Math.abs(position.x - this.state.food.x + this.width),
        Math.abs(position.x - this.state.food.x - this.width)
      )
    )
    
    const dy = Math.min(
      Math.abs(position.y - this.state.food.y),
      Math.min(
        Math.abs(position.y - this.state.food.y + this.height),
        Math.abs(position.y - this.state.food.y - this.height)
      )
    )
    
    return Math.sqrt(dx * dx + dy * dy)
  }

  calculateSpeedMultiplier(distance: number): number {
    const maxDistance = Math.sqrt(this.width * this.width + this.height * this.height)
    const threshold = maxDistance * 0.5
    
    if (distance > threshold) {
      return 2.0
    } else {
      return 1.0 + (distance / threshold)
    }
  }

  moveSnake(): { 
    newPosition: Position, 
    didEatFood: boolean, 
    isGameOver: boolean,
    didTeleport: boolean,
    didAutoAdjust: boolean
  } {
    const head = { ...this.state.snake[0] }
    
    let newX = head.x + this.state.direction.x * this.gridSize
    let newY = head.y + this.state.direction.y * this.gridSize
    
    const didTeleport = this.willTeleport(newX, newY)
    if (newX < 0) newX = this.width - this.gridSize
    if (newX >= this.width) newX = 0
    if (newY < 0) newY = this.height - this.gridSize
    if (newY >= this.height) newY = 0

    let newPosition = { x: newX, y: newY }
    let didAutoAdjust = false

    const adjustedPosition = this.shouldAutoAdjust(newPosition)
    if (adjustedPosition) {
      newPosition = adjustedPosition
      didAutoAdjust = true
    }

    const didEatFood = this.checkFood(newPosition)
    const isGameOver = !this.state.isInvincible && this.checkCollision(newPosition)

    if (!isGameOver) {
      this.state.snake.unshift({ ...newPosition })
      if (!didEatFood) {
        this.state.snake.pop()
      } else {
        this.onEatFood()
      }

      const distanceToFood = this.calculateDistanceToFood(newPosition)
      const speedMultiplier = this.calculateSpeedMultiplier(distanceToFood)
      const { minInterval, maxInterval, baseInterval, scoreSpeedupInterval } = SNAKE_GAME_CONFIG.gameplay.speed
      
      this.state.moveInterval = Math.max(minInterval, Math.min(maxInterval,
        baseInterval * (1 / speedMultiplier) - Math.floor(this.state.score / 100) * scoreSpeedupInterval))
    }

    return {
      newPosition,
      didEatFood,
      isGameOver,
      didTeleport,
      didAutoAdjust
    }
  }

  private willTeleport(x: number, y: number): boolean {
    const head = this.state.snake[0]
    return (
      (head.x === this.width - this.gridSize && x >= this.width) ||
      (head.x === 0 && x < 0) ||
      (head.y === this.height - this.gridSize && y >= this.height) ||
      (head.y === 0 && y < 0)
    )
  }

  private checkFood(position: Position): boolean {
    return position.x === this.state.food.x && position.y === this.state.food.y
  }

  private checkCollision(position: Position): boolean {
    return this.state.snake.some(segment => 
      segment.x === position.x && segment.y === position.y)
  }

  private shouldAutoAdjust(newPosition: Position): Position | null {
    const head = this.state.snake[0]
    const food = this.state.food
    
    // 如果蛇头和食物在同一直线上，不需要自动调整
    if (head.x === food.x || head.y === food.y) {
      return null
    }
    
    // 计算蛇头和食物的距离
    const distance = Math.abs(newPosition.x - food.x) + Math.abs(newPosition.y - food.y)
    
    // 只在接近食物时进行自动调整（距离小于3格）
    if (distance > this.gridSize * 3) {
      return null
    }
    
    // 判断是否即将错过食物
    const willMissFood = (
      (this.state.direction.x !== 0 && Math.abs(newPosition.y - food.y) === this.gridSize) ||
      (this.state.direction.y !== 0 && Math.abs(newPosition.x - food.x) === this.gridSize)
    )
    
    if (willMissFood) {
      // 创建可能的调整位置
      const adjustedPosition = { ...newPosition }
      
      if (this.state.direction.x !== 0) {
        // 水平移动时，调整Y坐标
        adjustedPosition.y = food.y
      } else {
        // 垂直移动时，调整X坐标
        adjustedPosition.x = food.x
      }
      
      // 检查调整后的位置是否安全
      if (!this.checkCollision(adjustedPosition)) {
        return adjustedPosition
      }
    }
    
    return null
  }

  private onEatFood() {
    const currentTime = Date.now()
    const { comboTimeWindow, baseScore } = SNAKE_GAME_CONFIG.gameplay.scoring
    
    if (currentTime - this.state.lastFoodTime < comboTimeWindow) {
      this.state.combo++
      this.state.score += baseScore * this.state.combo
    } else {
      this.state.combo = 1
      this.state.score += baseScore
    }
    this.state.lastFoodTime = currentTime
    this.placeFood()
  }

  private placeFood() {
    const gridWidth = this.width / this.gridSize
    const gridHeight = this.height / this.gridSize
    
    do {
      this.state.food = {
        x: Math.floor(Math.random() * gridWidth) * this.gridSize,
        y: Math.floor(Math.random() * gridHeight) * this.gridSize
      }
    } while (this.checkCollision(this.state.food))
  }

  activateInvincible(): boolean {
    const { requiredScore, duration } = SNAKE_GAME_CONFIG.gameplay.abilities.invincible
    
    if (!this.state.isInvincible && this.state.score >= requiredScore) {
      this.state.isInvincible = true
      this.state.score -= requiredScore
      
      setTimeout(() => {
        this.state.isInvincible = false
      }, duration)
      
      return true
    }
    return false
  }
} 