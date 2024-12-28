import { BaseResponseHandler } from '../abstract/BaseResponseHandler';
import { GameEventType, GameEventData } from '../types/events';
import { GameState } from '../types/state';
import { EventService } from '../core/services/EventService';

export class RunStateHandler extends BaseResponseHandler {
  private eventService: EventService;

  constructor(eventService: EventService) {
    super();
    this.eventService = eventService;
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

  handle(eventType: GameEventType, data: GameEventData[GameEventType], state: GameState): void {
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
        this.eventService.emit(GameEventType.STATE_CHANGE, state);
      }
    }
  }
} 