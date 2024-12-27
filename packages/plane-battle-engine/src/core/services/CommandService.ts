/**
 * @class CommandCenter
 * @description 命令中心 - 负责管理和执行游戏中的所有命令
 * 
 * @responsibility
 * - 注册和管理游戏命令
 * - 执行游戏命令
 * - 维护命令与状态管理器的关联
 * 
 * @dependencies
 * - EventCenter: 事件中心，用于发布命令执行的相关事件
 * - StateManager: 状态管理器，用于在命令执行时修改游戏状态
 * - GameCommand: 游戏命令接口
 * 
 * @usedBy
 * - GameEngine: 游戏引擎通过命令中心执行各种游戏操作
 * - InputService: 输入服务将用户输入转换为命令后通过命令中心执行
 * 
 * @singleton 使用单例模式，确保全局只有一个命令中心实例
 */

import { GameCommand, CommandParams } from '../../types/command-types';
import { EventService } from './EventService';
import { StateManager } from '../managers/StateManager';

export class CommandService {
  private static instance: CommandService;
  private eventCenter: EventService;
  private stateManager: StateManager;
  private commands: Map<string, GameCommand> = new Map();

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

  public executeCommand(commandName: string, params: CommandParams): void {
    const command = this.commands.get(commandName);
    if (command) {
      console.log('Executing command:', commandName, params);
      command.execute(this.stateManager, this.eventCenter, params);
    } else {
      console.warn(`Command ${commandName} not found`);
    }
  }
} 