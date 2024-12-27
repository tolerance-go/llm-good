import { ResponseHandler } from '../types/response-types';
import { GameEventType, GameEventData } from '../types/events';
import { GameState } from '../types/state';
import { GameConfig } from '../types/config';

export abstract class BaseResponseHandler implements ResponseHandler {
  private enabled: boolean = true;

  abstract getName(): string;
  abstract handle(eventType: GameEventType, data: GameEventData[GameEventType], state: GameState, config: GameConfig): void;
  abstract canHandle(eventType: GameEventType): boolean;
  abstract getPriority(): number;

  isEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
} 