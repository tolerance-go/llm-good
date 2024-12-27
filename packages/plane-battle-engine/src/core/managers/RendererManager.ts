import { GameRenderer, RenderStats } from '../../types/renderers';
import { RenderService } from '../services/RenderService';
import { PlayerRenderer } from '../../renderers/PlayerRenderer';
import { EnemyRenderer } from '../../renderers/EnemyRenderer';
import { BackgroundRenderer } from '../../renderers/BackgroundRenderer';
import { Application, Container } from 'pixi.js';
import { LogCollector } from '../../utils/LogCollector';

/**
 * @class RendererManager
 * @description 渲染器管理器 - 负责管理和协调所有渲染器
 */
export class RendererManager {
  private renderers: Map<string, GameRenderer> = new Map();
  private renderService: RenderService;
  private mainContainer: Container | null = null;
  private app: Application | null = null;
  private logger: LogCollector;

  constructor(renderService: RenderService) {
    this.logger = LogCollector.getInstance();
    this.logger.addLog('RendererManager', '初始化渲染管理器');
    this.renderService = renderService;
    this.app = renderService.getApp();
    this.initializeRenderers();
  }

  private initializeRenderers(): void {
    this.logger.addLog('RendererManager', '开始初始化所有渲染器');
    
    if (!this.app) {
      this.logger.addLog('RendererManager', '错误：应用实例未初始化');
      return;
    }

    // 创建主容器
    this.mainContainer = new Container();
    this.app.stage.addChild(this.mainContainer);
    
    // 注册所有渲染器
    const rendererInstances = [
      { name: 'background', renderer: new BackgroundRenderer() },
      { name: 'player', renderer: new PlayerRenderer() },
      { name: 'enemy', renderer: new EnemyRenderer() }
    ];

    rendererInstances.forEach(({ name, renderer }) => {
      this.logger.addLog('RendererManager', `注册渲染器: ${name}`);
      this.registerRenderer(name, renderer);
    });
  }

  private registerRenderer(name: string, renderer: GameRenderer): void {
    this.logger.addLog('RendererManager', `注册渲染器到渲染服务: ${name}`);
    this.renderers.set(name, renderer);
    
    if (this.mainContainer && this.app) {
      (renderer as PlayerRenderer | EnemyRenderer | BackgroundRenderer).setContainer(this.mainContainer, this.app);
    }
    
    this.renderService.registerRenderer(renderer);
  }

  public getRenderer(name: string): GameRenderer | undefined {
    return this.renderers.get(name);
  }

  public getAllRenderers(): GameRenderer[] {
    return Array.from(this.renderers.values());
  }

  public setDebugMode(enabled: boolean): void {
    this.renderers.forEach(renderer => renderer.setDebug(enabled));
  }

  public getStats(): { [key: string]: RenderStats } {
    const stats: { [key: string]: RenderStats } = {};
    this.renderers.forEach((renderer, name) => {
      stats[name] = renderer.getStats();
    });
    return stats;
  }

  public destroy(): void {
    if (this.mainContainer) {
      this.mainContainer.destroy({ children: true });
    }
    this.renderers.forEach(renderer => renderer.destroy());
    this.renderers.clear();
    this.mainContainer = null;
  }
} 