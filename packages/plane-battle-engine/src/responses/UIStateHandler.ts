import { BaseResponseHandler } from '../abstract/BaseResponseHandler';
import { GameEventType, GameEventData } from '../types/events';
import { GameState } from '../types/state';
import { EventService } from '../core/services/EventService';

export class UIStateHandler extends BaseResponseHandler {
  private eventCenter: EventService;

  constructor() {
    super();
    this.eventCenter = EventService.getInstance();
  }

  getName(): string {
    return 'UIStateHandler';
  }

  canHandle(eventType: GameEventType): boolean {
    return [
      GameEventType.UI_STATE_CHANGE,
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

  handle(eventType: GameEventType, data: GameEventData[GameEventType], state: GameState): void {
    if (!this.canHandle(eventType) || !this.isEnabled()) {
      return;
    }

    switch (eventType) {
      case GameEventType.UI_STATE_CHANGE:
        this.handleUIStateChange(data as GameEventData[GameEventType.UI_STATE_CHANGE], state);
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
        this.handleGameReset(state);
        break;
    }
  }

  private handleUIStateChange(data: GameEventData[GameEventType.UI_STATE_CHANGE], state: GameState): void {
    if (data.type === 'visibility') {
      // 更新UI状态
      state.ui = {
        ...state.ui,
        currentScreen: data.value.currentScreen,
        elements: data.value.elements
      };

      // 发送状态变更事件
      this.eventCenter.emit(GameEventType.STATE_CHANGE, state);
    }
  }

  private handleGameStart(state: GameState): void {
    state.ui = {
      ...state.ui,
      currentScreen: 'game',
      elements: {
        mainMenu: false,
        startButton: false,
        optionsButton: false,
        scoreDisplay: true,
        pauseMenu: false,
        gameOverScreen: false
      }
    };
  }

  private handleGamePause(state: GameState): void {
    state.ui = {
      ...state.ui,
      currentScreen: 'pause',
      elements: {
        mainMenu: false,
        startButton: false,
        optionsButton: false,
        scoreDisplay: true,
        pauseMenu: true,
        gameOverScreen: false
      }
    };
  }

  private handleGameResume(state: GameState): void {
    state.ui = {
      ...state.ui,
      currentScreen: 'game',
      elements: {
        mainMenu: false,
        startButton: false,
        optionsButton: false,
        scoreDisplay: true,
        pauseMenu: false,
        gameOverScreen: false
      }
    };
  }

  private handleGameOver(state: GameState): void {
    state.ui = {
      ...state.ui,
      currentScreen: 'gameOver',
      elements: {
        mainMenu: false,
        startButton: true,
        optionsButton: false,
        scoreDisplay: true,
        pauseMenu: false,
        gameOverScreen: true
      }
    };
  }

  private handleGameReset(state: GameState): void {
    state.ui = {
      ...state.ui,
      currentScreen: 'menu',
      elements: {
        mainMenu: true,
        startButton: true,
        optionsButton: true,
        scoreDisplay: false,
        pauseMenu: false,
        gameOverScreen: false
      }
    };
  }
} 