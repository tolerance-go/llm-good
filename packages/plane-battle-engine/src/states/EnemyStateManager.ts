import { GameState } from '../types/state';
import { GameConfig } from '../types/config';

export class EnemyStateManager {
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
  }

  update(state: GameState): void {
    // 更新所有敌人的状态
    state.enemies = state.enemies.filter(enemy => {
      // 更新位置
      enemy.position.x += enemy.velocity.x * enemy.speed;
      enemy.position.y += enemy.velocity.y * enemy.speed;

      // 检查是否超出边界
      const outOfBounds = 
        enemy.position.x < -enemy.size.width ||
        enemy.position.x > this.config.canvas.width + enemy.size.width ||
        enemy.position.y < -enemy.size.height ||
        enemy.position.y > this.config.canvas.height + enemy.size.height;

      // 如果超出边界或不活跃，移除敌人
      return !outOfBounds && enemy.active;
    });
  }
} 