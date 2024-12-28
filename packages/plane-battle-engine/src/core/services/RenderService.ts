/**
 * @class RenderService
 * @description 渲染服务 - 负责管理和协调所有渲染器
 * 
 * @responsibility
 * - 初始化和管理 PixiJS 应用实例
 * - 提供渲染器注册接口
 * - 协调渲染流程
 * - 处理渲染性能统计
 * - 提供调试视图支持
 * - 处理输入事件
 * 
 * @dependencies
 * - GameRenderer: 渲染器接口
 * - GameState: 游戏状态
 * - GameConfig: 游戏配置
 * - LogCollector: 日志收集器
 */

import { GameRenderer, RenderStats, PlayerInput } from '../../types/renderers';
import { GameState } from '../../types/state';
import { GameConfig } from '../../types/config';
import { LogCollector } from '../../utils/LogCollector';
import { Application } from 'pixi.js';
import { PixiService } from './PixiService';

export class RenderService implements GameRenderer {
  private static instance: RenderService | null = null;
  private gameState: GameState | null = null;
  private config: GameConfig | null = null;
  private logger: LogCollector;
  private debugMode: boolean = false;
  private lastRenderTime: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;
  private renderers: Set<GameRenderer> = new Set();
  private inputHandlers: Array<(input: PlayerInput) => void> = [];
  private lastLogTime: number = 0;
  private logUpdateInterval: number = 1000;
  private pixiService: PixiService;

  private constructor() {
    this.logger = LogCollector.getInstance();
    this.logger.addLog('RenderService', '初始化渲染服务');
    this.pixiService = PixiService.getInstance();
  }

  public static getInstance(): RenderService {
    if (!RenderService.instance) {
      RenderService.instance = new RenderService();
    }
    return RenderService.instance;
  }

  async initialize(config: GameConfig, container: HTMLElement): Promise<void> {
    this.logger.addLog('RenderService', '初始化渲染服务', { width: config.canvas.width, height: config.canvas.height });
    this.config = config;

    // 使用 PixiService 初始化应用实例
    await this.pixiService.initialize(config, container);
    
    // 初始化所有渲染器
    for (const renderer of this.renderers) {
      if (this.config) {
        renderer.initialize(this.config, this.pixiService.getApp()!.canvas);
      }
    }
  }

  registerRenderer(renderer: GameRenderer): void {
    this.logger.addLog('RenderService', '注册新渲染器', { rendererType: renderer.constructor.name });
    this.renderers.add(renderer);
    if (this.config && this.pixiService.getApp()) {
      renderer.initialize(this.config, this.pixiService.getApp()!.canvas);
    }
  }

  // 移除渲染器
  unregisterRenderer(renderer: GameRenderer): void {
    this.renderers.delete(renderer);
  }

  // 注册输入处理器
  onInput(handler: (input: PlayerInput) => void): void {
    this.inputHandlers.push(handler);
  }

  // 触发输入事件
  private triggerInput(input: PlayerInput): void {
    this.inputHandlers.forEach(handler => handler(input));
  }

  render(state: GameState): void {
    if (!this.pixiService.getApp()) {
      this.logger.addLog('RenderService', '渲染失败：应用实例未初始化');
      return;
    }

    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime - this.lastRenderTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastRenderTime = currentTime;
      
      this.logger.addLog('RenderService', '性能统计', { fps: this.fps });
    }

    // 调用所有注册的渲染器进行渲染
    for (const renderer of this.renderers) {
      if (currentTime - this.lastLogTime >= this.logUpdateInterval) {
        this.logger.addLog('RenderService', '调用渲染器', { rendererType: renderer.constructor.name });
      }
      renderer.render(state);
    }

    // 更新最后日志时间
    if (currentTime - this.lastLogTime >= this.logUpdateInterval) {
      this.lastLogTime = currentTime;
    }
  }

  setDebug(enabled: boolean): void {
    this.debugMode = enabled;
    this.renderers.forEach(renderer => renderer.setDebug(enabled));
  }

  getStats(): RenderStats {
    return {
      fps: this.fps,
      drawCalls: this.frameCount,
      entities: Array.from(this.renderers).reduce((total: number, renderer: GameRenderer) => total + renderer.getStats().entities, 0)
    };
  }

  getApp(): Application | null {
    return this.pixiService.getApp();
  }
  /**
   * 检查视觉测试是否就绪
   */
  isVisualTestReady(): boolean {
    return this.pixiService.getApp()?.canvas.hasAttribute('data-visual-test-ready') ?? false;
  }

  destroy(): void {
    this.renderers.forEach(renderer => renderer.destroy());
    this.renderers = new Set();
    
    this.pixiService.destroy();
    
    this.gameState = null;
    this.config = null;
    this.inputHandlers = [];
  }
} 