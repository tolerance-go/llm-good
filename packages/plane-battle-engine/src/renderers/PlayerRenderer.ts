import { Container, Sprite, Graphics, RenderTexture, Application } from 'pixi.js';
import { GameState } from '../types';
import { GameRenderer, RenderStats } from '../types/renderers';
import { GameConfig } from '../types/config';
import { LogCollector } from '../utils/LogCollector';
import { PixiService } from '../core/services/PixiService';

export class PlayerRenderer implements GameRenderer {
  private container: Container | null = null;
  private playerSprite: Sprite | null = null;
  private lastPosition: { x: number; y: number } = { x: 400, y: 568 };
  private logger: LogCollector;
  private debugMode: boolean = false;
  private config: GameConfig | null = null;
  private debugGraphics: Graphics | null = null;
  private app: Application | null = null;

  constructor() {
    this.logger = LogCollector.getInstance();
    this.logger.addLog('PlayerRenderer', '创建玩家渲染器实例');
  }

  async initialize(config: GameConfig, pixiService: PixiService): Promise<void> {
    this.logger.addLog('PlayerRenderer', '初始化玩家渲染器', { 
      hasConfig: !!config,
      hasPixiService: !!pixiService
    });
    this.config = config;
    
    // 获取 PixiJS 应用实例
    const app = pixiService.getApp();
    if (!app) {
      throw new Error('PixiJS 应用实例未初始化');
    }
    this.app = app;

    // 创建主容器
    this.container = new Container();
    app.stage.addChild(this.container);
    
    // 创建玩家精灵
    if (this.playerSprite) {
      this.logger.addLog('PlayerRenderer', '销毁已存在的玩家精灵');
      this.playerSprite.destroy();
    }
    
    this.logger.addLog('PlayerRenderer', '创建新的玩家精灵');
    
    // 创建一个临时的矩形作为玩家精灵
    const graphics = new Graphics();
    graphics.beginFill(0x00ff00);
    graphics.drawRect(-15, -15, 30, 30); // 中心点在矩形中心
    graphics.endFill();
    
    // 创建渲染纹理
    const texture = RenderTexture.create({ width: 30, height: 30 });
    app.renderer.render(graphics, { renderTexture: texture });
    
    this.playerSprite = new Sprite(texture);
    graphics.destroy();
    
    // 设置初始位置
    this.playerSprite.position.set(400, 568);
    
    // 设置锚点为中心
    this.playerSprite.anchor.set(0.5);
    
    // 添加到容器
    this.container.addChild(this.playerSprite);

    this.logger.addLog('PlayerRenderer', '玩家精灵创建完成', { 
      position: { x: 400, y: 568 },
      hasSprite: !!this.playerSprite
    });
  }

  public render(state: GameState): void {
    if (!this.container || !this.playerSprite) {
      this.logger.addLog('PlayerRenderer', '渲染失败', {
        hasContainer: !!this.container,
        hasSprite: !!this.playerSprite
      });
      return;
    }

    // 只在游戏进行中显示玩家
    this.playerSprite.visible = state.status === 'playing';

    // 如果玩家不可见，直接返回
    if (!this.playerSprite.visible) return;

    // 更新玩家精灵的位置
    if (state.player) {
      const newPosition = state.player.position;
      
      // 只有当位置发生变化时才更新和记录日志
      if (this.lastPosition.x !== newPosition.x || this.lastPosition.y !== newPosition.y) {
        const logData = {
          from: { ...this.lastPosition },
          to: { ...newPosition },
          delta: {
            x: newPosition.x - this.lastPosition.x,
            y: newPosition.y - this.lastPosition.y
          }
        };
        this.logger.addLog('PlayerRenderer', '更新玩家位置', logData);
        
        this.playerSprite.position.set(newPosition.x, newPosition.y);
        this.lastPosition = { ...newPosition };
      }
      
      // 更新旋转
      if (state.player.rotation !== undefined) {
        this.playerSprite.rotation = state.player.rotation;
      }
      
      // 更新缩放
      if (state.player.scale) {
        this.playerSprite.scale.set(state.player.scale.x, state.player.scale.y);
      }

      // 调试模式下显示额外信息
      if (this.debugMode) {
        this.updateDebugGraphics();
        this.logger.addLog('PlayerRenderer', '调试信息', {
          position: this.lastPosition,
          rotation: state.player.rotation,
          scale: state.player.scale
        });
      }
    }
  }

  private updateDebugGraphics(): void {
    if (!this.debugGraphics) {
      this.debugGraphics = new Graphics();
      this.container?.addChild(this.debugGraphics);
    }

    this.debugGraphics.clear();
    this.debugGraphics.lineStyle(1, 0xff0000);
    
    // 绘制边界框
    if (this.playerSprite) {
      const bounds = this.playerSprite.getBounds();
      this.debugGraphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
      
      // 绘制中心点
      this.debugGraphics.lineStyle(1, 0x00ff00);
      this.debugGraphics.moveTo(bounds.x + bounds.width / 2 - 5, bounds.y + bounds.height / 2);
      this.debugGraphics.lineTo(bounds.x + bounds.width / 2 + 5, bounds.y + bounds.height / 2);
      this.debugGraphics.moveTo(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2 - 5);
      this.debugGraphics.lineTo(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2 + 5);
    }
  }

  public setDebug(enabled: boolean): void {
    this.debugMode = enabled;
    if (!enabled && this.debugGraphics) {
      this.debugGraphics.destroy();
      this.debugGraphics = null;
    }
  }

  public getStats(): RenderStats {
    return {
      fps: 0,
      drawCalls: 1,
      entities: 1
    };
  }

  public destroy(): void {
    this.logger.addLog('PlayerRenderer', '开始销毁玩家渲染器');
    if (this.playerSprite) {
      this.logger.addLog('PlayerRenderer', '销毁玩家精灵');
      this.playerSprite.destroy();
      this.playerSprite = null;
    }
    if (this.debugGraphics) {
      this.debugGraphics.destroy();
      this.debugGraphics = null;
    }
    this.container = null;
    this.app = null;
    this.logger.addLog('PlayerRenderer', '玩家渲染器销毁完成');
  }
} 