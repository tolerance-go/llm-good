import { GameState } from './state';
import { GameConfig } from './config';
import { GameEventType, GameEventData } from './events';

export interface ResponseHandler {
  getName(): string;
  handle(eventType: GameEventType, data: GameEventData[GameEventType], state: GameState, config: GameConfig): void;
  canHandle(eventType: GameEventType): boolean;
  getPriority(): number;
  isEnabled(): boolean;
  setEnabled(enabled: boolean): void;
}

export type BaseResponseHandler = ResponseHandler; 