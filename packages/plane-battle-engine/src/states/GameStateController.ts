import { GameState } from '../types/state';
import { GameConfig } from '../types/config';
import { EventService } from '../core/services/EventService';
import { GameEventType } from '../types/events';

export class GameStateController {
  private config: GameConfig;
  private eventService: EventService;

  constructor(config: GameConfig, eventService: EventService) {
    this.config = config;
    this.eventService = eventService;
  }

  // 重置游戏状态
  reset(state: GameState): void {
    // 重置玩家状态
    state.player = {
      id: 'player',
      health: this.config.player.initialHealth,
      lives: this.config.player.lives,
      position: { ...this.config.player.respawnPosition },
      size: { ...this.config.player.size },
      speed: this.config.player.speed,
      score: 0,
      fireRate: this.config.player.fireRate,
      lastFireTime: 0,
      powerups: [],
      invincible: false,
      respawning: false,
      velocity: { x: 0, y: 0 },
      active: true,
      rotation: 0,
      scale: { x: 1, y: 1 },
      combo: {
        count: 0,
        timer: 0,
        multiplier: 1
      },
      weapons: {
        bulletSpeed: this.config.weapons.bulletSpeed,
        bulletDamage: this.config.weapons.bulletDamage
      }
    };

    // 清空敌人
    state.enemies = [];

    // 清空子弹
    state.bullets = [];

    // 清空道具
    state.powerups = [];

    // 重置游戏进度
    state.currentLevel = 1;
    state.currentWave = 1;
    state.score = 0;
    state.time = 0;

    // 重置游戏状态
    state.status = 'init';
    state.isPaused = false;
    state.isGameOver = false;
    state.previousStatus = undefined;

    // 重置性能统计
    state.performance = {
      fps: 0,
      frameTime: 0,
      updateTime: 0,
      renderTime: 0
    };

    // 重置输入状态
    state.input = {
      type: 'move',
      data: {},
      keyboard: {
        up: false,
        down: false,
        left: false,
        right: false,
        space: false
      }
    };

    // 发送重置事件
    this.eventService.emit(GameEventType.GAME_RESET, undefined);
  }

  update(state: GameState): void {
    // 更新游戏状态
    if (state.status === 'playing') {
      // 检查游戏是否结束
      if (state.player.lives <= 0) {
        state.status = 'gameOver';
        state.isGameOver = true;
      }

      // 检查关卡进度
      if (state.enemies.length === 0) {
        state.currentWave++;
        if (state.currentWave > this.config.rules.progression.wavesPerLevel) {
          state.currentLevel++;
          state.currentWave = 1;
        }
      }
    }
  }
} 