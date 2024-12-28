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
  private lastTime: number = 0;
  private animationFrameId: number | null = null;
  private logger: LogCollector;
  private isInitialized: boolean = false;

  constructor(config: Partial<GameConfig>, container: HTMLElement) {
    this.logger = LogCollector.getInstance();
    this.logger.addLog('GameEngine', '初始化游戏引擎');
    
    // 初始化配置管理器
    this.configManager = new ConfigManager(config);
    const gameConfig = this.configManager.getConfig();
    
    // 初始化状态管理器
    this.stateManager = StateManager.getInstance(gameConfig);
    
    // 初始化事件服务
    this.eventService = EventService.getInstance();
    
    // 初始化渲染服务
    this.renderService = RenderService.getInstance();
    
    // 初始化命令管理器
    this.commandManager = CommandManager.getInstance(this.stateManager, gameConfig);
    
    // 初始化响应管理器
    this.responseManager = ResponseManager.getInstance(gameConfig, this.stateManager);
    
    // 初始化输入服务
    this.inputService = InputService.getInstance();

    // 异步初始化渲染服务
    this.initializeAsync(gameConfig, container);
  }

  private async initializeAsync(gameConfig: GameConfig, container: HTMLElement): Promise<void> {
    try {
      // 初始化渲染服务
      await this.renderService.initialize(gameConfig, container);
      
      // 初始化渲染管理器（需要在渲染服务之后初始化）
      this.rendererManager = new RendererManager(this.renderService);
      
      this.isInitialized = true;
      this.logger.addLog('GameEngine', '游戏引擎初始化完成');
    } catch (error) {
      this.logger.addLog('GameEngine', '游戏引擎初始化失败', { error });
      throw error;
    }
  }

  private gameLoop(timestamp: number): void {
    if (!this.isInitialized || !this.rendererManager) return;

    const deltaTime = this.lastTime ? (timestamp - this.lastTime) / 1000 : 0;
    this.lastTime = timestamp;

    const state = this.stateManager.getState();
    
    if (state.status !== 'playing') {
      this.logger.addLog('GameEngine', '游戏未处于播放状态', { status: state.status });
      return;
    }

    // 更新游戏状态
    this.update(deltaTime);

    // 渲染游戏对象
    this.logger.addLog('GameEngine', '开始渲染帧');
    this.renderService.render(state);

    // 发送渲染事件
    this.eventService.emit(GameEventType.RENDER_FRAME, { deltaTime });

    // 继续游戏循环
    if (state.status === 'playing') {
      this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
  }

  private update(deltaTime: number): void {
    const state = this.stateManager.getState();
    if (!state || state.status !== 'playing') {
      return;
    }
    
    // 更新游戏状态
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
      this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
  }

  public pauseGame(): void {
    const state = this.stateManager.getState();
    if (state) {
      state.status = 'paused';
      this.stateManager.setState(state);
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
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
      if (this.animationFrameId === null) {
        this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
      }
    }
  }

  public resetGame(): void {
    this.stateManager.resetState();
    this.eventService.emit(GameEventType.GAME_RESET, undefined);
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
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
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.inputService.destroy();
    this.renderService.destroy();
    this.rendererManager = null;
  }
} 