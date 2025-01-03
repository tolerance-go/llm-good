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

import { GameCommand } from "../../types/command-types";
import { StateManager } from "../managers/StateManager";
import {
  CommandType,
  CommandDataMap,
  CommandReturnMap,
  CommandMiddleware,
} from "../../types/command-types";
import { EventService } from "./EventService";

export class CommandService {
  private commands: Map<CommandType, GameCommand> = new Map();
  private middlewares: CommandMiddleware[] = [];
  private stateManager: StateManager;
  private eventService: EventService;

  constructor(stateManager: StateManager, eventService: EventService) {
    this.stateManager = stateManager;
    this.eventService = eventService;
  }

  public registerMiddleware(middleware: CommandMiddleware): void {
    this.middlewares.push(middleware);
  }

  public registerCommand(command: GameCommand): void {
    this.commands.set(command.getName(), command);
  }

  public async executeCommand<T extends CommandType>(
    commandType: T,
    params: CommandDataMap[T]
  ): Promise<CommandReturnMap[T]> {
    const command = this.commands.get(commandType);
    if (command) {
      try {
        // 执行前置中间件
        for (const middleware of this.middlewares) {
          if (middleware.before) {
            await middleware.before(commandType, params);
          }
        }

        // 执行命令
        const result = await command.execute(params);

        // 执行后置中间件
        for (const middleware of this.middlewares) {
          if (middleware.after) {
            await middleware.after(commandType, params, result);
          }
        }

        return result as CommandReturnMap[T];
      } catch (error) {
        console.error(`Error executing command ${commandType}:`, error);
        throw error;
      }
    } else {
      throw new Error(`Command ${commandType} not found`);
    }
  }

  public getCommand(commandType: CommandType): GameCommand | undefined {
    return this.commands.get(commandType);
  }

  public hasCommand(commandType: CommandType): boolean {
    return this.commands.has(commandType);
  }

  public clearCommands(): void {
    this.commands.clear();
  }
}
