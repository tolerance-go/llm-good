import { GameState } from '../types/state';
import { GameConfig } from '../types/config';

export class PlayerStateController {
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
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
      const moveSpeed = player.speed * 5;

      // 更新位置
      player.position.x += x * moveSpeed;
      player.position.y += y * moveSpeed;

      // 限制在画布范围内
      player.position.x = Math.max(
        player.size.width / 2,
        Math.min(this.config.canvas.width - player.size.width / 2, player.position.x)
      );
      player.position.y = Math.max(
        player.size.height / 2,
        Math.min(this.config.canvas.height - player.size.height / 2, player.position.y)
      );
    }
  }
} 