import { GameState } from '../types/state';
import { GameConfig } from '../types/config';
import { EventService } from '../core/services/EventService';

export class BulletStateControllerr {
  private config: GameConfig;
  private eventService: EventService;

  constructor(config: GameConfig, eventService: EventService) {
    this.config = config;
    this.eventService = eventService;
  }

  update(state: GameState): void {
    // 更新所有子弹的状态
    state.bullets = state.bullets.filter(bullet => {
      // 更新位置
      bullet.position.x += bullet.velocity.x * bullet.speed;
      bullet.position.y += bullet.velocity.y * bullet.speed;

      // 检查是否超出边界
      const outOfBounds = 
        bullet.position.x < -bullet.size.width ||
        bullet.position.x > this.config.canvas.width + bullet.size.width ||
        bullet.position.y < -bullet.size.height ||
        bullet.position.y > this.config.canvas.height + bullet.size.height;

      // 如果超出边界或不活跃，移除子弹
      return !outOfBounds && bullet.active;
    });
  }
} 