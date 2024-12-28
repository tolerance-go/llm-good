import { BaseResponseHandler } from '../abstract/BaseResponseHandler';
import { GameEventType, GameEventData } from '../types/events';
import { GameState } from '../types/state';
import { GameConfig } from '../types/config';
import { EventService } from '../core/services/EventService';

export class RunStateHandler extends BaseResponseHandler {
  private eventCenter: EventService;

  constructor() {
    super();
    this.eventCenter = EventService.getInstance();
  }

  getName(): string {
    return 'RunStateHandler';
  }

  canHandle(eventType: GameEventType): boolean {
    return [
      GameEventType.RUN_STATE_CHANGE
    ].includes(eventType);
  }

  getPriority(): number {
    return 1;
  }

  handle(eventType: GameEventType, data: GameEventData[GameEventType], state: GameState, config: GameConfig): void {
    if (!this.canHandle(eventType) || !this.isEnabled()) {
      return;
    }

    if (eventType === GameEventType.RUN_STATE_CHANGE) {
      const runStateData = data as GameEventData[GameEventType.RUN_STATE_CHANGE];
      if (runStateData.type === 'status') {
        const { status, isPaused, isGameOver } = runStateData.value;
        
        // 更新状态
        if (status !== undefined) {
          state.status = status;
        }
        if (isPaused !== undefined) {
          state.isPaused = isPaused;
        }
        if (isGameOver !== undefined) {
          state.isGameOver = isGameOver;
        }

        // 发送状态变更事件
        this.eventCenter.emit(GameEventType.STATE_CHANGE, state);
      }
    }
  }
} 