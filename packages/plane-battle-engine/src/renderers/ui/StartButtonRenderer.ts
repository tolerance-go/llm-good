import { Container, Text, Graphics } from 'pixi.js';
import { GameState } from '../../types/state';
import { GameConfig } from '../../types/config';
import { LogCollector } from '../../utils/LogCollector';
import { BaseUIRenderer } from '../../abstract/BaseUIRenderer';
import { EventService } from '../../core/services/EventService';
import { GameEventType } from '../../types/events';
import { PixiService } from '../../core/services/PixiService';

export class StartButtonRenderer extends BaseUIRenderer {
  private button: Container | null = null;
  private logger: LogCollector;
  private eventService: EventService;

  constructor(eventService: EventService) {
    super();
    this.logger = LogCollector.getInstance();
    this.eventService = eventService;
    this.logger.addLog('StartButtonRenderer', '创建开始按钮渲染器实例');
  }

  async initialize(config: GameConfig, pixiService: PixiService): Promise<void> {
    this.logger.addLog('StartButtonRenderer', '初始化开始按钮渲染器');
    this.config = config;
    const app = pixiService.getApp();
    if (!app) {
      throw new Error('PixiJS 应用实例未初始化');
    }
    this.app = app;

    this.logger.addLog('StartButtonRenderer', `屏幕尺寸: ${app.screen.width}x${app.screen.height}`);

    // 创建主容器
    this.container = new Container();
    app.stage.addChild(this.container);

    // 创建按钮容器
    this.button = new Container();
    
    // 创建按钮背景
    const background = new Graphics();
    background.beginFill(0x4CAF50);
    background.drawRoundedRect(0, 0, 200, 50, 10);
    background.endFill();

    // 创建按钮文本
    const text = new Text('开始游戏', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center'
    });

    // 设置文本位置
    text.anchor.set(0.5);
    text.position.set(100, 25);

    // 将背景和文本添加到按钮容器
    this.button.addChild(background);
    this.button.addChild(text);

    // 设置按钮交互
    this.button.eventMode = 'static';
    this.button.cursor = 'pointer';
    this.button.on('pointerdown', () => {
      this.logger.addLog('StartButtonRenderer', '按钮被点击');
      this.eventService.emit(GameEventType.GAME_START, undefined);
    });

    // 设置按钮初始位置（屏幕中心）
    const centerX = app.screen.width / 2;
    const centerY = app.screen.height / 2;
    this.button.position.set(centerX - 100, centerY - 25); // 减去按钮尺寸的一半

    // 添加到主容器
    this.container.addChild(this.button);
    
    this.logger.addLog('StartButtonRenderer', `按钮位置: x=${this.button.x}, y=${this.button.y}`);
    this.logger.addLog('StartButtonRenderer', `主容器位置: x=${this.container.x}, y=${this.container.y}`);
    this.logger.addLog('StartButtonRenderer', `主容器可见性: ${this.container.visible}`);
    this.logger.addLog('StartButtonRenderer', '开始按钮创建完成');
  }

  render(state: GameState): void {
    if (!this.button) return;

    // 只在初始状态和游戏结束时显示按钮
    this.button.visible = state.status === 'init' || state.status === 'gameOver';
    
    if (this.button.visible) {
      // 更新按钮文本
      const text = this.button.getChildAt(1) as Text;
      text.text = state.status === 'gameOver' ? '重新开始' : '开始游戏';
      
      this.logger.addLog('StartButtonRenderer', '更新按钮状态', {
        visible: this.button.visible,
        position: { x: this.button.x, y: this.button.y },
        text: text.text
      });
    }
  }

  destroy(): void {
    this.logger.addLog('StartButtonRenderer', '开始销毁开始按钮渲染器');
    if (this.button) {
      this.button.destroy();
      this.button = null;
    }
    this.container = null;
    this.app = null;
    this.logger.addLog('StartButtonRenderer', '开始按钮渲染器销毁完成');
  }
} 