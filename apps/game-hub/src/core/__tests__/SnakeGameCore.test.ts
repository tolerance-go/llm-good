import { describe, it, expect, beforeEach } from 'vitest'
import { SnakeGameCore, Position } from '../SnakeGameCore'

describe('SnakeGameCore - 智能变速系统', () => {
  let game: SnakeGameCore

  beforeEach(() => {
    game = new SnakeGameCore(800, 600)
  })

  it('距离食物越远，移动速度应该越快', () => {
    game.setState({
      food: { x: 0, y: 0 }
    })

    const farPosition: Position = { x: 700, y: 500 }
    const closePosition: Position = { x: 50, y: 50 }
    
    const farDistance = game.calculateDistanceToFood(farPosition)
    const closeDistance = game.calculateDistanceToFood(closePosition)
    
    const farSpeedMultiplier = game.calculateSpeedMultiplier(farDistance)
    const closeSpeedMultiplier = game.calculateSpeedMultiplier(closeDistance)

    // 远距离的速度倍数应该大于近距离
    expect(farSpeedMultiplier).toBeGreaterThan(closeSpeedMultiplier)
    // 远距离速度不应超过最大限制
    expect(farSpeedMultiplier).toBeLessThanOrEqual(2.0)
    // 近距离速度不应低于基础速度
    expect(closeSpeedMultiplier).toBeGreaterThanOrEqual(1.0)
  })

  it('计算与食物的最短距离时应考虑穿墙', () => {
    game.setState({
      food: { x: 0, y: 0 }
    })

    // 测试水平穿墙距离计算
    const distanceFromRight = game.calculateDistanceToFood({ x: 780, y: 0 })
    const normalDistance = game.calculateDistanceToFood({ x: 400, y: 0 })
    
    // 从右边穿墙到左边的距离应该小于从中间到左边的距离
    expect(distanceFromRight).toBeLessThan(780)
    expect(distanceFromRight).toBeLessThan(normalDistance)
  })
})

describe('SnakeGameCore - 穿墙系统', () => {
  let game: SnakeGameCore

  beforeEach(() => {
    game = new SnakeGameCore(800, 600)
  })

  it('蛇应该能够从右边界穿到左边界', () => {
    game.setState({
      snake: [{ x: 780, y: 300 }],
      direction: { x: 1, y: 0 }
    })
    
    // 移动蛇
    const result = game.moveSnake()
    
    // 验证穿墙
    expect(result.newPosition.x).toBe(0)
    expect(result.newPosition.y).toBe(300)
    expect(result.didTeleport).toBe(true)
  })

  it('蛇应该能够从上边界穿到下边界', () => {
    game.setState({
      snake: [{ x: 400, y: 0 }],
      direction: { x: 0, y: -1 }
    })
    
    // 移动蛇
    const result = game.moveSnake()
    
    // 验证穿墙
    expect(result.newPosition.x).toBe(400)
    expect(result.newPosition.y).toBe(580) // 600 - 20
    expect(result.didTeleport).toBe(true)
  })

  it('无敌状态下不应该发生碰撞', () => {
    game.setState({
      snake: [
        { x: 200, y: 200 },
        { x: 220, y: 200 },
        { x: 240, y: 200 }
      ],
      direction: { x: -1, y: 0 },
      score: 100,
      isInvincible: true
    })
    
    const result = game.moveSnake()
    
    // 验证游戏没有结束
    expect(result.isGameOver).toBe(false)
  })
}) 