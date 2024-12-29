import { GameCommand } from '../../types/command-types';
import { CommandService } from '../services/CommandService';
import { StateManager } from './StateManager';
import { MoveCommand } from '../../commands/MoveCommand';
import { ShootCommand } from '../../commands/ShootCommand';
import { PauseCommand } from '../../commands/PauseCommand';
import { ResumeCommand } from '../../commands/ResumeCommand';
import { ResetCommand } from '../../commands/ResetCommand';
import { GameConfig } from '../../types/config';
import { EventService } from '../services/EventService';
import { StateLoggerMiddleware } from '../../middlewares/StateLoggerMiddleware';

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
  private commandService: CommandService;
  private config: GameConfig;
  private eventService: EventService;
  private stateManager: StateManager;

  constructor(stateManager: StateManager, config: GameConfig, eventService: EventService) {
    this.commandService = new CommandService(stateManager, eventService);
    this.config = config;
    this.eventService = eventService;
    this.stateManager = stateManager;

    // 初始化中间件
    this.initializeMiddlewares();
    // 初始化命令
    this.initializeCommands();
  }

  /**
   * 初始化中间件
   */
  private initializeMiddlewares(): void {
    // 注册状态日志中间件
    const stateLoggerMiddleware = new StateLoggerMiddleware(this.stateManager);
    this.commandService.registerMiddleware(stateLoggerMiddleware);
  }

  /**
   * 初始化并注册所有游戏命令
   */
  private initializeCommands(): void {
    // 注册移动命令
    const moveCommand = new MoveCommand(this.config, this.stateManager);
    this.commandService.registerCommand(moveCommand);

    // 注册射击命令
    const shootCommand = new ShootCommand(this.config, this.stateManager);
    this.commandService.registerCommand(shootCommand);

    // 注册暂停命令
    const pauseCommand = new PauseCommand(this.config, this.eventService, this.stateManager);
    this.commandService.registerCommand(pauseCommand);

    // 注册恢复命令
    const resumeCommand = new ResumeCommand(this.config, this.eventService, this.stateManager);
    this.commandService.registerCommand(resumeCommand);

    // 注册重置命令
    const resetCommand = new ResetCommand(this.config, this.eventService, this.stateManager);
    this.commandService.registerCommand(resetCommand);
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