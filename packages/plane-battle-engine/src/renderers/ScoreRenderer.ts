import { Container, Text, Application } from 'pixi.js';
import { GameState } from '../types/state';
import { GameRenderer, RenderStats } from '../types/renderers';
import { GameConfig } from '../types/config';
import { LogCollector } from '../utils/LogCollector';

export class ScoreRenderer implements GameRenderer {
  private container: Container | null = null;
  private scoreText: Text | null = null;
  private config: GameConfig | null = null;
  private app: Application | null = null;
  private logger: LogCollector;
  private debugMode: boolean = false;

  constructor() {
    this.logger = LogCollector.getInstance();
    this.logger.addLog('ScoreRenderer', '创建得分渲染器实例');
  }

  initialize(config: GameConfig, canvas: HTMLCanvasElement): void {
    this.logger.addLog('ScoreRenderer', '初始化得分渲染器');
    this.config = config;
    this.logger.addLog('ScoreRenderer', '画布尺寸', {
      width: canvas.width,
      height: canvas.height
    });
  }

  setContainer(container: Container, app: Application): void {
    this.logger.addLog('ScoreRenderer', '设置容器开始');
    this.container = container;
    this.app = app;

    // 创建得分文本
    if (this.scoreText) {
      this.logger.addLog('ScoreRenderer', '销毁已存在的得分文本');
      this.scoreText.destroy();
    }

    this.logger.addLog('ScoreRenderer', '创建新的得分文本');
    this.scoreText = new Text('得分: 0', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'left'
    });

    // 设置文本位置在屏幕左上角
    this.scoreText.position.set(20, 20);

    // 添加到容器
    container.addChild(this.scoreText);

    this.logger.addLog('ScoreRenderer', '得分文本创建完成');
  }

  public render(state: GameState): void {
    if (!this.container || !this.scoreText) {
      this.logger.addLog('ScoreRenderer', '渲染失败：容器或文本不存在');
      return;
    }

    // 更新得分显示
    const score = state.score || 0;
    this.scoreText.text = `得分: ${score}`;

    if (this.debugMode) {
      this.logger.addLog('ScoreRenderer', '更新得分', { score });
    }
  }

  public setDebug(enabled: boolean): void {
    this.debugMode = enabled;
  }

  public getStats(): RenderStats {
    return {
      fps: 0,
      drawCalls: 1,
      entities: 1
    };
  }

  public destroy(): void {
    this.logger.addLog('ScoreRenderer', '开始销毁得分渲染器');
    if (this.scoreText) {
      this.logger.addLog('ScoreRenderer', '销毁得分文本');
      this.scoreText.destroy();
      this.scoreText = null;
    }
    this.container = null;
    this.app = null;
    this.logger.addLog('ScoreRenderer', '得分渲染器销毁完成');
  }
} 