import { GameState, UIState } from '../types/state';
import { GameConfig } from '../types/config';
import { EventService } from '../core/services/EventService';
import { GameEventType } from '../types/events';

export class UIStateController {
  private config: GameConfig;
  private eventService: EventService;

  constructor(config: GameConfig) {
    this.config = config;
    this.eventService = EventService.getInstance();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    // 监听UI相关事件
    this.eventService.on(GameEventType.GAME_START, () => {
      this.handleUIVisibility('game');
    });

    this.eventService.on(GameEventType.GAME_PAUSE, () => {
      this.handleUIVisibility('pause');
    });

    this.eventService.on(GameEventType.GAME_OVER, () => {
      this.handleUIVisibility('gameOver');
    });

    this.eventService.on(GameEventType.GAME_RESET, () => {
      this.handleUIVisibility('menu');
    });
  }

  private handleUIVisibility(screen: 'menu' | 'game' | 'pause' | 'gameOver'): void {
    this.eventService.emit(GameEventType.UI_STATE_CHANGE, {
      type: 'visibility',
      value: {
        currentScreen: screen,
        elements: this.getUIElementsForScreen(screen)
      }
    });
  }

  private getUIElementsForScreen(screen: string): UIState['elements'] {
    switch (screen) {
      case 'menu':
        return {
          mainMenu: true,
          startButton: true,
          optionsButton: true,
          scoreDisplay: false,
          pauseMenu: false,
          gameOverScreen: false
        };
      case 'game':
        return {
          mainMenu: false,
          startButton: false,
          optionsButton: false,
          scoreDisplay: true,
          pauseMenu: false,
          gameOverScreen: false
        };
      case 'pause':
        return {
          mainMenu: false,
          startButton: false,
          optionsButton: false,
          scoreDisplay: true,
          pauseMenu: true,
          gameOverScreen: false
        };
      case 'gameOver':
        return {
          mainMenu: false,
          startButton: true,
          optionsButton: false,
          scoreDisplay: true,
          pauseMenu: false,
          gameOverScreen: true
        };
      default:
        return {
          mainMenu: false,
          startButton: false,
          optionsButton: false,
          scoreDisplay: false,
          pauseMenu: false,
          gameOverScreen: false
        };
    }
  }

  update(state: GameState): void {
    // 根据游戏状态自动更新UI
    if (state.status !== state.previousStatus) {
      switch (state.status) {
        case 'playing':
          this.handleUIVisibility('game');
          break;
        case 'paused':
          this.handleUIVisibility('pause');
          break;
        case 'gameOver':
          this.handleUIVisibility('gameOver');
          break;
        case 'init':
          this.handleUIVisibility('menu');
          break;
      }
    }
  }
} 