/**
 * @class GameEngine
 * @description 游戏引擎 - 游戏的核心控制器
 * 
 * @responsibility
 * - 初始化和管理游戏生命周期
 * - 协调各个管理器之间的交互
 * - 处理游戏主循环
 * - 管理游戏状态
 * 
 * @dependencies
 * - StateManager: 状态管理器
 * - ConfigManager: 配置管理器
 * - InputService: 输入服务
 * - CommandService: 命令服务
 * - RenderService: 渲染服务
 * - ResponseManager: 响应管理器
 * - EventService: 事件服务
 */

import { GameConfig } from '../types/config';
import { GameState } from '../types/state';
import { GameEventType, GameEventData } from '../types/events';
import { LogCollector } from '../utils/LogCollector';

// 导入核心服务
import { EventService } from './services/EventService';
import { RenderService } from './services/RenderService';
import { InputService } from './services/InputService';
import { PixiService } from './services/PixiService';
import { GameLoopService } from './services/GameLoopService';

// 导入核心管理器
import { ConfigManager } from './managers/ConfigManager';
import { StateManager } from './managers/StateManager';
import { ResponseManager } from './managers/ResponseManager';
import { RendererManager } from './managers/RendererManager';
import { CommandManager } from './managers/CommandManager';

export class GameEngine {
  private configManager: ConfigManager;
  private stateManager: StateManager;
  private eventService: EventService;
  private commandManager: CommandManager;
  private renderService: RenderService;
  private responseManager: ResponseManager;
  private inputService: InputService;
  private rendererManager: RendererManager | null = null;
  private logger: LogCollector;
  private isInitialized: boolean = false;
  private pixiService: PixiService;
  private gameLoopService: GameLoopService;

  constructor(config: Partial<GameConfig>, container: HTMLElement) {
    // 初始化日志收集器（保持单例）
    this.logger = LogCollector.getInstance();
    this.logger.addLog('GameEngine', '初始化游戏引擎');
    
    // 初始化事件服务
    this.eventService = new EventService();
    
    // 初始化配置管理器
    this.configManager = new ConfigManager(config);
    const gameConfig = this.configManager.getConfig();
    
    // 初始化状态管理器
    this.stateManager = new StateManager(gameConfig, this.eventService);
    
    // 初始化PixiJS服务
    this.pixiService = new PixiService();
    
    // 初始化渲染服务
    this.renderService = new RenderService(this.pixiService);
    
    // 初始化命令管理器
    this.commandManager = new CommandManager(this.stateManager, gameConfig, this.eventService);
    
    // 初始化响应管理器
    this.responseManager = new ResponseManager(gameConfig, this.stateManager, this.eventService, this.commandManager);
    
    // 初始化输入服务
    this.inputService = new InputService(this.eventService);

    // 初始化游戏循环服务
    this.gameLoopService = new GameLoopService(this.eventService);

    // 设置游戏循环事件监听
    this.eventService.on(GameEventType.GAME_UPDATE, ({ deltaTime }) => this.update(deltaTime));
    this.eventService.on(GameEventType.RENDER_FRAME, () => {
      const state = this.stateManager.getState();
      this.renderService.render(state);
    });

    // 异步初始化渲染服务
    this.initializeAsync(gameConfig, container);
  }

  private async initializeAsync(gameConfig: GameConfig, container: HTMLElement): Promise<void> {
    try {
      // 初始化渲染服务
      await this.renderService.initialize(gameConfig, container);
      
      // 初始化渲染管理器
      this.rendererManager = new RendererManager(this.renderService);
      
      this.isInitialized = true;
      this.logger.addLog('GameEngine', '游戏引擎初始化完成');
    } catch (error) {
      this.logger.addLog('GameEngine', '游戏引擎初始化失败', { error });
      throw error;
    }
  }

  private update(deltaTime: number): void {
    const state = this.stateManager.getState();
    if (!state || state.status !== 'playing') {
      this.logger.addLog('GameEngine', '游戏未处于播放状态', { status: state?.status });
      return;
    }
    
    // 更新游戏状态
    this.logger.addLog('GameEngine', '开始更新游戏状态', { deltaTime });
    this.stateManager.updateState(deltaTime);
  }

  public startGame(): void {
    if (!this.isInitialized || !this.rendererManager) {
      this.logger.addLog('GameEngine', '游戏引擎尚未初始化完成，无法开始游戏');
      return;
    }

    this.logger.addLog('GameEngine', '开始游戏');
    const state = this.stateManager.getState();
    if (state) {
      state.status = 'playing';
      this.stateManager.setState(state);
      this.gameLoopService.start();
    }
  }

  public pauseGame(): void {
    const state = this.stateManager.getState();
    if (state) {
      state.status = 'paused';
      this.stateManager.setState(state);
      this.gameLoopService.stop();
    }
  }

  public resumeGame(): void {
    if (!this.isInitialized || !this.rendererManager) {
      this.logger.addLog('GameEngine', '游戏引擎尚未初始化完成，无法恢复游戏');
      return;
    }

    const state = this.stateManager.getState();
    if (state) {
      state.status = 'playing';
      this.stateManager.setState(state);
      this.gameLoopService.start();
    }
  }

  public resetGame(): void {
    this.stateManager.resetState();
    this.eventService.emit(GameEventType.GAME_RESET, undefined);
    this.gameLoopService.stop();
  }

  public getState(): GameState {
    return this.stateManager.getState();
  }

  public getConfig(): GameConfig {
    return this.configManager.getConfig();
  }

  public updateConfig(config: Partial<GameConfig>): void {
    this.configManager.updateConfig(config);
  }

  public setDebug(enabled: boolean): void {
    this.renderService.setDebug(enabled);
    this.eventService.setDebug(enabled);
  }

  public on<T extends GameEventType>(
    event: T,
    handler: (data: GameEventData[T]) => void
  ): void {
    this.eventService.on(event, handler);
  }

  public destroy(): void {
    this.gameLoopService.destroy();
    this.inputService.destroy();
    this.renderService.destroy();
    this.rendererManager = null;
  }
} 