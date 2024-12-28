import { GameState } from '../types/state';
import { GameConfig } from '../types/config';
import { Vector2D } from '../types/base';

export class PlayerStateController {
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
  }

  // 移动玩家
  move(state: GameState, direction: Vector2D, deltaTime: number): void {
    const { player } = state;
    const speed = player.speed * deltaTime;
    const newX = player.position.x + direction.x * speed;
    const newY = player.position.y + direction.y * speed;

    // 确保玩家不会移出画布
    const minX = player.size.width / 2;
    const maxX = this.config.canvas.width - player.size.width / 2;
    const minY = player.size.height / 2;
    const maxY = this.config.canvas.height - player.size.height / 2;

    player.position.x = Math.max(minX, Math.min(maxX, newX));
    player.position.y = Math.max(minY, Math.min(maxY, newY));
  }

  update(state: GameState): void {
    const { player } = state;

    // 更新无敌状态
    if (player.invincible) {
      player.invincible = false;
    }

    // 更新连击状态
    if (player.combo.timer > 0) {
      player.combo.timer -= 16; // 假设每帧16ms
      if (player.combo.timer <= 0) {
        player.combo.count = 0;
        player.combo.multiplier = 1;
      }
    }

    // 更新武器冷却
    if (player.lastFireTime > 0) {
      player.lastFireTime = Math.max(0, player.lastFireTime - 16);
    }

    // 处理玩家移动
    if (state.input.type === 'move' && state.input.data) {
      const { x = 0, y = 0 } = state.input.data;
      this.move(state, { x, y }, 1/60);
    }
  }
} 