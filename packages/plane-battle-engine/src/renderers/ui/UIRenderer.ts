import { Container } from 'pixi.js';
import { GameState } from '../../types/state';
import { GameConfig } from '../../types/config';
import { BaseUIRenderer } from '../../abstract/BaseUIRenderer';
import { ScoreRenderer } from './ScoreRenderer';
import { StartButtonRenderer } from './StartButtonRenderer';
import { LogCollector } from '../../utils/LogCollector';
import { EventService } from '../../core/services/EventService';
import { PixiService } from '../../core/services/PixiService';

export class UIRenderer extends BaseUIRenderer {
  private renderers: BaseUIRenderer[] = [];
  private logger: LogCollector;
  private eventService: EventService;

  constructor(eventService: EventService) {
    super();
    this.logger = LogCollector.getInstance();
    this.eventService = eventService;
    this.initializeRenderers();
  }

  private initializeRenderers(): void {
    // 初始化所有UI子渲染器
    this.renderers = [
      new ScoreRenderer(),
      new StartButtonRenderer(this.eventService)
    ];
  }

  async initialize(config: GameConfig, pixiService: PixiService): Promise<void> {
    this.logger.addLog('UIRenderer', '初始化UI渲染器');
    this.config = config;
    const app = pixiService.getApp();
    if (!app) {
      throw new Error('PixiJS 应用实例未初始化');
    }
    this.app = app;

    // 创建主容器
    this.container = new Container();
    app.stage.addChild(this.container);

    // 初始化所有子渲染器
    for (const renderer of this.renderers) {
      await renderer.initialize(config, pixiService);
    }
  }

  render(state: GameState): void {
    if (!this.container || !this.app) {
      this.logger.addLog('UIRenderer', '渲染失败：容器或应用不存在');
      return;
    }

    // 渲染所有子UI组件
    this.renderers.forEach(renderer => {
      renderer.render(state);
    });
  }

  setDebug(enabled: boolean): void {
    super.setDebug(enabled);
    // 设置所有子渲染器的调试模式
    this.renderers.forEach(renderer => {
      renderer.setDebug(enabled);
    });
  }

  destroy(): void {
    this.logger.addLog('UIRenderer', '开始销毁UI渲染器');
    // 销毁所有子渲染器
    this.renderers.forEach(renderer => {
      renderer.destroy();
    });
    this.renderers = [];
    this.container = null;
    this.app = null;
    this.logger.addLog('UIRenderer', 'UI渲染器销毁完成');
  }
} 