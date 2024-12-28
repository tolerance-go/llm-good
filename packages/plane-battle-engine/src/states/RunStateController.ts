import { GameState } from '../types/state';
import { GameConfig } from '../types/config';
import { EventService } from '../core/services/EventService';
import { GameEventType } from '../types/events';

export class RunStateController {
  private config: GameConfig;
  private eventService: EventService;

  constructor(config: GameConfig) {
    this.config = config;
    this.eventService = EventService.getInstance();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    // 监听游戏开始事件
    this.eventService.on(GameEventType.GAME_START, () => {
      this.handleGameStart();
    });

    // 监听游戏暂停事件
    this.eventService.on(GameEventType.GAME_PAUSE, () => {
      this.handleGamePause();
    });

    // 监听游戏恢复事件
    this.eventService.on(GameEventType.GAME_RESUME, () => {
      this.handleGameResume();
    });

    // 监听游戏结束事件
    this.eventService.on(GameEventType.GAME_OVER, () => {
      this.handleGameOver();
    });

    // 监听游戏重置事件
    this.eventService.on(GameEventType.GAME_RESET, () => {
      this.handleGameReset();
    });
  }

  private handleGameStart(): void {
    this.eventService.emit(GameEventType.RUN_STATE_CHANGE, {
      type: 'status',
      value: {
        status: 'playing',
        isPaused: false,
        isGameOver: false
      }
    });
  }

  private handleGamePause(): void {
    this.eventService.emit(GameEventType.RUN_STATE_CHANGE, {
      type: 'status',
      value: {
        status: 'paused',
        isPaused: true
      }
    });
  }

  private handleGameResume(): void {
    this.eventService.emit(GameEventType.RUN_STATE_CHANGE, {
      type: 'status',
      value: {
        status: 'playing',
        isPaused: false
      }
    });
  }

  private handleGameOver(): void {
    this.eventService.emit(GameEventType.RUN_STATE_CHANGE, {
      type: 'status',
      value: {
        status: 'gameOver',
        isGameOver: true
      }
    });
  }

  private handleGameReset(): void {
    this.eventService.emit(GameEventType.RUN_STATE_CHANGE, {
      type: 'status',
      value: {
        status: 'init',
        isPaused: false,
        isGameOver: false
      }
    });
  }

  update(state: GameState): void {
    // 在这里可以添加一些运行状态的自动更新逻辑
    // 比如检查某些条件自动触发状态改变
    if (state.status === 'playing') {
      if (state.player.lives <= 0) {
        this.handleGameOver();
      }
    }
  }
} 