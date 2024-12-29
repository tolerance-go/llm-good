import { Container, Text } from 'pixi.js';
import { GameState } from '../../types/state';
import { GameConfig } from '../../types/config';
import { LogCollector } from '../../utils/LogCollector';
import { BaseUIRenderer } from '../../abstract/BaseUIRenderer';
import { PixiService } from '../../core/services/PixiService';

export class ScoreRenderer extends BaseUIRenderer {
  private scoreText: Text | null = null;
  private logger: LogCollector;

  constructor() {
    super();
    this.logger = LogCollector.getInstance();
    this.logger.addLog('ScoreRenderer', '创建得分渲染器实例');
  }

  async initialize(config: GameConfig, pixiService: PixiService): Promise<void> {
    this.logger.addLog('ScoreRenderer', '初始化得分渲染器');
    this.config = config;
    const app = pixiService.getApp();
    if (!app) {
      throw new Error('PixiJS 应用实例未初始化');
    }
    this.app = app;

    this.logger.addLog('ScoreRenderer', '画布尺寸', {
      width: config.canvas.width,
      height: config.canvas.height
    });

    // 创建主容器
    this.container = new Container();
    app.stage.addChild(this.container);

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
    this.container.addChild(this.scoreText);

    this.logger.addLog('ScoreRenderer', '得分文本创建完成');
  }

  render(state: GameState): void {
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

  destroy(): void {
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