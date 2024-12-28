import { GameCommand } from '../../types/command-types';
import { CommandService } from '../services/CommandService';
import { StateManager } from './StateManager';
import { MoveCommand } from '../../commands/MoveCommand';
import { GameConfig } from '../../types/config';

/**
 * @class CommandManager
 * @description 命令管理器 - 负责初始化和管理所有游戏命令
 * 
 * @responsibility
 * - 初始化所有游戏命令
 * - 将命令注册到命令服务中
 * - 提供命令管理的接口
 */
export class CommandManager {
  private static instance: CommandManager;
  private commandService: CommandService;
  private config: GameConfig;

  private constructor(stateManager: StateManager, config: GameConfig) {
    this.commandService = CommandService.getInstance(stateManager);
    this.config = config;

    // 在构造函数中初始化所有命令
    this.initializeCommands();
  }

  public static getInstance(stateManager?: StateManager, config?: GameConfig): CommandManager {
    if (!CommandManager.instance && stateManager && config) {
      CommandManager.instance = new CommandManager(stateManager, config);
    }
    return CommandManager.instance;
  }

  /**
   * 初始化并注册所有游戏命令
   */
  private initializeCommands(): void {
    // 注册移动命令
    const moveCommand = new MoveCommand(this.config);
    this.commandService.registerCommand(moveCommand);

    // TODO: 在这里注册其他命令
    // 例如: ShootCommand, PauseCommand 等
  }

  /**
   * 获取命令服务实例
   */
  public getCommandService(): CommandService {
    return this.commandService;
  }

  /**
   * 注册新的命令
   */
  public registerCommand(command: GameCommand): void {
    this.commandService.registerCommand(command);
  }
} 