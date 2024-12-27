import { BaseResponseHandler } from '../abstract/BaseResponseHandler';
import { GameEventType, GameEventData } from '../types/events';
import { GameState } from '../types/state';
import { GameConfig } from '../types/config';
import { EventService } from '../core/services/EventService';

export class GameStateHandler extends BaseResponseHandler {
  private eventCenter: EventService;

  constructor() {
    super();
    this.eventCenter = EventService.getInstance();
  }

  getName(): string {
    return 'GameStateHandler';
  }

  canHandle(eventType: GameEventType): boolean {
    return [
      GameEventType.GAME_INIT,
      GameEventType.GAME_START,
      GameEventType.GAME_PAUSE,
      GameEventType.GAME_RESUME,
      GameEventType.GAME_OVER,
      GameEventType.GAME_RESET
    ].includes(eventType);
  }

  getPriority(): number {
    return 1;
  }

  handle(eventType: GameEventType, data: GameEventData[GameEventType], state: GameState, config: GameConfig): void {
    if (!this.canHandle(eventType) || !this.isEnabled()) {
      return;
    }

    switch (eventType) {
      case GameEventType.GAME_INIT:
        this.handleGameInit(state, config);
        break;
      case GameEventType.GAME_START:
        this.handleGameStart(state);
        break;
      case GameEventType.GAME_PAUSE:
        this.handleGamePause(state);
        break;
      case GameEventType.GAME_RESUME:
        this.handleGameResume(state);
        break;
      case GameEventType.GAME_OVER:
        this.handleGameOver(state);
        break;
      case GameEventType.GAME_RESET:
        this.handleGameReset(state, config);
        break;
    }
  }

  private handleGameInit(state: GameState, config: GameConfig): void {
    state.status = 'init';
    state.currentLevel = 1;
    state.currentWave = 1;
    state.score = 0;
    state.time = 0;
    state.player = {
      id: 'player',
      health: config.player.initialHealth,
      lives: config.player.lives,
      position: { x: config.canvas.width / 2, y: config.canvas.height - 50 },
      velocity: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1 },
      size: config.player.size,
      speed: config.player.speed,
      score: 0,
      fireRate: config.player.fireRate,
      lastFireTime: 0,
      powerups: [],
      invincible: false,
      respawning: false,
      active: true,
      combo: {
        count: 0,
        timer: 0,
        multiplier: 1
      },
      weapons: {
        bulletSpeed: config.weapons.bulletSpeed,
        bulletDamage: config.weapons.bulletDamage
      }
    };
    state.enemies = [];
    state.bullets = [];
    state.powerups = [];
  }

  private handleGameStart(state: GameState): void {
    state.status = 'playing';
  }

  private handleGamePause(state: GameState): void {
    state.status = 'paused';
  }

  private handleGameResume(state: GameState): void {
    state.status = 'playing';
  }

  private handleGameOver(state: GameState): void {
    state.status = 'gameOver';
  }

  private handleGameReset(state: GameState, config: GameConfig): void {
    this.handleGameInit(state, config);
  }
} 