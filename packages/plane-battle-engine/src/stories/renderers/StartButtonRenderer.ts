import * as PIXI from 'pixi.js';
import { GameRenderer } from '../../types/renderers';
import { GameConfig } from '../../types/config';
import { GameState } from '../../types/state';
import { LogCollector } from '../../utils/LogCollector';
import { PixiService } from '../../core/services/PixiService';

export class StartButtonRenderer implements GameRenderer {
  private container: PIXI.Container;
  private button: PIXI.Container;
  private buttonText: PIXI.Text;
  private background: PIXI.Graphics;
  private logger: LogCollector;

  constructor() {
    this.logger = LogCollector.getInstance();
    this.logger.addLog('StartButtonRenderer', '创建按钮渲染器');

    this.container = new PIXI.Container();
    this.button = new PIXI.Container();
    this.background = new PIXI.Graphics();
    
    // 创建文本
    this.buttonText = new PIXI.Text({
      text: '开始游戏',
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
      }
    });

    this.buttonText.anchor.set(0.5);
    
    // 构建按钮
    this.button.addChild(this.background);
    this.button.addChild(this.buttonText);
    this.container.addChild(this.button);

    // 设置交互
    this.button.eventMode = 'static';
    this.button.cursor = 'pointer';
    
    // 添加鼠标事件
    this.button.on('pointerover', () => this.onButtonOver());
    this.button.on('pointerout', () => this.onButtonOut());
    this.button.on('pointerdown', () => this.onButtonDown());
    this.button.on('pointerup', () => this.onButtonUp());
  }

  private onButtonOver(): void {
    this.background.tint = 0x999999;
  }

  private onButtonOut(): void {
    this.background.tint = 0xffffff;
  }

  private onButtonDown(): void {
    this.background.tint = 0x666666;
  }

  private onButtonUp(): void {
    this.background.tint = 0xffffff;
    this.logger.addLog('StartButtonRenderer', '点击了开始游戏按钮');
  }

  async initialize(config: GameConfig, pixiService: PixiService): Promise<void> {
    this.logger.addLog('StartButtonRenderer', '初始化开始');

    // 绘制按钮背景
    this.background.clear();
    this.background.beginFill(0x3498db);
    this.background.drawRoundedRect(-75, -25, 150, 50, 10);
    this.background.endFill();

    // 设置按钮位置
    this.button.position.set(config.canvas.width / 2, config.canvas.height / 2);
    
    // 确保文本位于按钮中心
    this.buttonText.position.set(0, 0);

    // 确保容器可见
    this.container.visible = true;
    this.button.visible = true;

    // 添加到舞台
    const app = pixiService.getApp();
    if (app?.stage) {
      app.stage.addChild(this.container);
      this.logger.addLog('StartButtonRenderer', '按钮已添加到舞台');
    }

    this.logger.addLog('StartButtonRenderer', '初始化完成', {
      buttonX: this.button.x,
      buttonY: this.button.y,
      containerVisible: this.container.visible,
      buttonVisible: this.button.visible
    });
  }

  render(state: GameState): void {
    // 按钮状态由事件处理器管理，不需要特殊的渲染逻辑
    this.logger.addLog('StartButtonRenderer', '渲染按钮', {
      buttonVisible: this.button.visible,
      gameState: state.status
    });
  }

  setDebug(enabled: boolean): void {
    if (enabled) {
      this.background.lineStyle(2, 0x00FF00);
    } else {
      this.background.lineStyle(0);
    }
  }

  getStats() {
    return {
      fps: 0,
      drawCalls: 1,
      entities: 1
    };
  }

  destroy(): void {
    this.logger.addLog('StartButtonRenderer', '销毁按钮渲染器');
    this.button.removeAllListeners();
    this.container.destroy({ children: true });
  }
} 