import { Container, Application } from 'pixi.js';
import { GameState } from '../../types/state';
import { GameConfig } from '../../types/config';
import { BaseUIRenderer } from '../../abstract/BaseUIRenderer';
import { ScoreRenderer } from './ScoreRenderer';
import { StartButtonRenderer } from './StartButtonRenderer';
import { LogCollector } from '../../utils/LogCollector';

export class UIRenderer extends BaseUIRenderer {
  private renderers: BaseUIRenderer[] = [];
  private logger: LogCollector;

  constructor() {
    super();
    this.logger = LogCollector.getInstance();
    this.initializeRenderers();
  }

  private initializeRenderers(): void {
    // 初始化所有UI子渲染器
    this.renderers = [
      new ScoreRenderer(),
      new StartButtonRenderer()
    ];
  }

  initialize(config: GameConfig, canvas: HTMLCanvasElement): void {
    this.logger.addLog('UIRenderer', '初始化UI渲染器');
    this.config = config;

    // 初始化所有子渲染器
    this.renderers.forEach(renderer => {
      renderer.initialize(config, canvas);
    });
  }

  setContainer(container: Container, app: Application): void {
    this.logger.addLog('UIRenderer', '设置UI容器');
    this.container = container;
    this.app = app;

    // 为每个子渲染器设置容器
    this.renderers.forEach(renderer => {
      renderer.setContainer(container, app);
    });
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