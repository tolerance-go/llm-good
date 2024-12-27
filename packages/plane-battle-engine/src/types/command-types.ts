import { EventService } from '../core/services/EventService';
import { StateManager } from '../core/managers/StateManager';

export type CommandType = 'move' | 'shoot' | 'pause' | 'resume' | 'reset';

export interface CommandData {
  move: {
    direction: { x: number; y: number };
    deltaTime: number;
  };
  shoot: {
    position: { x: number; y: number };
  };
  pause: void;
  resume: void;
  reset: void;
}

export type CommandParams = {
  [K in CommandType]: CommandData[K];
}[CommandType];

export interface GameCommand {
  getName(): string;
  execute(stateManager: StateManager, eventCenter: EventService, params: CommandParams): void;
}

export interface Command<T extends CommandType = CommandType> {
  type: T;
  setData(data: CommandData[T]): void;
  execute(): void;
  undo?(): void;
}

export interface CommandHandler<T extends CommandType = CommandType> {
  type: T;
  handle(data: CommandData[T]): void;
} 