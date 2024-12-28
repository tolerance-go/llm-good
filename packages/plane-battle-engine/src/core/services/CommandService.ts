/**
 * @class CommandService
 * @description 命令中心 - 负责管理和执行游戏中的所有命令
 * 
 * @responsibility
 * - 注册和管理游戏命令
 * - 执行游戏命令
 * - 维护命令与状态管理器的关联
 * - 发布命令执行相关事件
 * 
 * @dependencies
 * - EventService: 事件中心，用于发布命令执行的相关事件
 * - StateManager: 状态管理器，用于在命令执行时修改游戏状态
 * - GameCommand: 游戏命令接口
 * 
 * @usedBy
 * - GameEngine: 游戏引擎通过命令中心执行各种游戏操作
 * - InputService: 输入服务将用户输入转换为命令后通过命令中心执行
 * 
 * @singleton 使用单例模式，确保全局只有一个命令中心实例
 */

import { GameCommand, CommandType, CommandDataMap, CommandParams, CommandReturnMap, CommandTypeEnum } from '../../types/command-types';
import { EventService } from './EventService';
import { StateManager } from '../managers/StateManager';
import { GameEventType } from '../../types/events';

export class CommandService {
  private static instance: CommandService;
  private eventCenter: EventService;
  private stateManager: StateManager;
  private commands: Map<CommandType, GameCommand> = new Map();

  private constructor(stateManager: StateManager) {
    this.eventCenter = EventService.getInstance();
    this.stateManager = stateManager;
  }

  public static getInstance(stateManager?: StateManager): CommandService {
    if (!CommandService.instance && stateManager) {
      CommandService.instance = new CommandService(stateManager);
    }
    return CommandService.instance;
  }

  public registerCommand(command: GameCommand): void {
    this.commands.set(command.getName(), command);
  }

  public async executeCommand<T extends CommandType>(
    commandType: T, 
    params: CommandDataMap[T]
  ): Promise<void | CommandReturnMap[T]> {
    const command = this.commands.get(commandType);
    if (command) {
      console.log('Executing command:', commandType, params);
      try {
        // 执行命令
        const result = await command.execute(this.stateManager, params as CommandParams);

        // 发送命令执行事件
        switch (commandType) {
          case CommandTypeEnum.MOVE: {
            const moveParams = params as CommandDataMap[typeof CommandTypeEnum.MOVE];
            this.eventCenter.emit(GameEventType.PLAYER_MOVE, {
              type: 'move',
              data: {
                x: moveParams.direction.x,
                y: moveParams.direction.y
              }
            });
            break;
          }
          case CommandTypeEnum.SHOOT: {
            const shootParams = params as CommandDataMap[typeof CommandTypeEnum.SHOOT];
            this.eventCenter.emit(GameEventType.PLAYER_SHOOT, {
              position: shootParams.position
            });
            break;
          }
          case CommandTypeEnum.PAUSE:
            this.eventCenter.emit(GameEventType.GAME_PAUSE, undefined);
            break;
          case CommandTypeEnum.RESUME:
            this.eventCenter.emit(GameEventType.GAME_RESUME, undefined);
            break;
          case CommandTypeEnum.RESET:
            this.eventCenter.emit(GameEventType.GAME_RESET, undefined);
            break;
        }

        return result as void | CommandReturnMap[T];
      } catch (error) {
        console.error(`Error executing command ${commandType}:`, error);
        throw error;
      }
    } else {
      const error = new Error(`Command ${commandType} not found`);
      console.warn(error.message);
      throw error;
    }
  }

  public hasCommand(commandType: CommandType): boolean {
    return this.commands.has(commandType);
  }

  public clearCommands(): void {
    this.commands.clear();
  }
} 