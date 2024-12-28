import { GameState, UIState } from '../../types/state';
import { GameConfig } from '../../types/config';
import { EventService } from '../../core/services/EventService';
import { GameEventType } from '../../types/events';
import { LogCollector } from '../../utils/LogCollector';
import { StartButtonStateController } from './StartButtonStateController';

export class UIStateController {
  private config: GameConfig;
  private eventService: EventService;
  private logger: LogCollector;
  private startButtonController: StartButtonStateController;

  constructor(config: GameConfig) {
    this.config = config;
    this.eventService = EventService.getInstance();
    this.logger = LogCollector.getInstance();
    this.startButtonController = new StartButtonStateController(config);
    this.logger.addLog('UIStateController', '初始化UI状态控制器');
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    // 监听UI相关事件
    this.eventService.on(GameEventType.GAME_START, () => {
      this.logger.addLog('UIStateController', '游戏开始，更新UI状态');
      this.handleUIVisibility('game');
    });

    this.eventService.on(GameEventType.GAME_PAUSE, () => {
      this.logger.addLog('UIStateController', '游戏暂停，更新UI状态');
      this.handleUIVisibility('pause');
    });

    this.eventService.on(GameEventType.GAME_OVER, () => {
      this.logger.addLog('UIStateController', '游戏结束，更新UI状态');
      this.handleUIVisibility('gameOver');
    });

    this.eventService.on(GameEventType.GAME_RESET, () => {
      this.logger.addLog('UIStateController', '游戏重置，更新UI状态');
      this.handleUIVisibility('menu');
    });
  }

  private handleUIVisibility(screen: 'menu' | 'game' | 'pause' | 'gameOver'): void {
    this.logger.addLog('UIStateController', `切换UI显示状态: ${screen}`);
    const elements = this.getUIElementsForScreen(screen);
    
    // 获取开始按钮状态
    const startButtonState = this.startButtonController.getButtonState(screen);
    this.startButtonController.updateState(screen);
    
    this.eventService.emit(GameEventType.UI_STATE_CHANGE, {
      type: 'visibility',
      value: {
        currentScreen: screen,
        elements: elements,
        startButtonState
      }
    });
  }

  private getUIElementsForScreen(screen: string): UIState['elements'] {
    this.logger.addLog('UIStateController', `获取${screen}场景UI元素状态`);
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
      this.logger.addLog('UIStateController', `游戏状态变化: ${state.previousStatus} -> ${state.status}`);
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