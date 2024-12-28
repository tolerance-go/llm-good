import { StateManager } from '../core/managers/StateManager';

// 命令类型枚举
export enum CommandTypeEnum {
  MOVE = 'move',
  SHOOT = 'shoot',
  PAUSE = 'pause',
  RESUME = 'resume',
  RESET = 'reset'
}

// 命令类型字符串联合类型
export type CommandType = CommandTypeEnum;

// 命令返回值类型映射
export interface CommandReturnMap {
  [CommandTypeEnum.MOVE]: {
    newPosition: { x: number; y: number };
    success: boolean;
  } | void;
  [CommandTypeEnum.SHOOT]: {
    bulletId: string;
    success: boolean;
  } | void;
  [CommandTypeEnum.PAUSE]: {
    success: boolean;
    previousStatus: string;
  } | void;
  [CommandTypeEnum.RESUME]: {
    success: boolean;
    newStatus: string;
  } | void;
  [CommandTypeEnum.RESET]: {
    success: boolean;
  } | void;
}

// 命令数据类型映射
export interface CommandDataMap {
  [CommandTypeEnum.MOVE]: {
    direction: { x: number; y: number };
    deltaTime: number;
  };
  [CommandTypeEnum.SHOOT]: {
    position: { x: number; y: number };
  };
  [CommandTypeEnum.PAUSE]: void;
  [CommandTypeEnum.RESUME]: void;
  [CommandTypeEnum.RESET]: void;
}

// 命令参数类型
export type CommandParams = {
  [K in CommandType]: CommandDataMap[K];
}[CommandType];

// 命令返回类型
export type CommandReturn = {
  [K in CommandType]: CommandReturnMap[K];
}[CommandType];

// 命令接口
export interface GameCommand {
  getName(): CommandType;
  execute(
    params?: CommandParams
  ): void | CommandReturn | Promise<void | CommandReturn>;
}

// 泛型命令接口
export interface TypedCommand<T extends CommandType> {
  type: T;
  setData(data: CommandDataMap[T]): void;
  execute(): void | CommandReturnMap[T] | Promise<void | CommandReturnMap[T]>;
  undo?(): void;
}

// 泛型命令处理器接口
export interface CommandHandler<T extends CommandType> {
  type: T;
  handle(data: CommandDataMap[T]): void | CommandReturnMap[T] | Promise<void | CommandReturnMap[T]>;
} 