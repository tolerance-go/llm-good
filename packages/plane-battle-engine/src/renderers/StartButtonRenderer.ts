import { Container, Text, Graphics, Application } from 'pixi.js';
import { GameState } from '../types/state';
import { GameConfig } from '../types/config';
import { LogCollector } from '../utils/LogCollector';
import { BaseUIRenderer } from '../abstract/BaseUIRenderer';
import { EventService } from '../core/services/EventService';
import { GameEventType } from '../types/events';

export class StartButtonRenderer extends BaseUIRenderer {
  private button: Container | null = null;
  private logger: LogCollector;
  private eventService: EventService;

  constructor() {
    super();
    this.logger = LogCollector.getInstance();
    this.eventService = EventService.getInstance();
    this.logger.addLog('StartButtonRenderer', '创建开始按钮渲染器实例');
  }

  initialize(config: GameConfig): void {
    this.logger.addLog('StartButtonRenderer', '初始化开始按钮渲染器');
    this.config = config;
  }

  setContainer(container: Container, app: Application): void {
    this.logger.addLog('StartButtonRenderer', '设置容器开始');
    this.container = container;
    this.app = app;

    // ���建按钮容器
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

    // 设置按钮位置
    this.button.position.set(
      (app.screen.width - 200) / 2,
      (app.screen.height - 50) / 2
    );

    // 设置按钮交互
    this.button.eventMode = 'static';
    this.button.cursor = 'pointer';
    this.button.on('pointerdown', () => {
      this.eventService.emit(GameEventType.GAME_START, undefined);
    });

    // 添��到主容器
    container.addChild(this.button);

    this.logger.addLog('StartButtonRenderer', '开始按钮创建完成');
  }

  render(state: GameState): void {
    if (!this.button) return;

    // 根据游戏状态显示或隐藏按钮
    this.button.visible = state.status === 'init' || state.status === 'gameOver';

    // 更新按钮文本
    if (this.button.visible) {
      const text = this.button.getChildAt(1) as Text;
      text.text = state.status === 'gameOver' ? '重新开始' : '开始游戏';
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