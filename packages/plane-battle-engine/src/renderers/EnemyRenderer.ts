import { Container, Sprite, Graphics, RenderTexture, Application } from 'pixi.js';
import { GameState } from '../types';
import { GameRenderer, RenderStats } from '../types/renderers';
import { GameConfig } from '../types/config';
import { LogCollector } from '../utils/LogCollector';
import { PixiService } from '../core/services/PixiService';

export class EnemyRenderer implements GameRenderer {
  private container: Container | null = null;
  private app: Application | null = null;
  private enemySprites: Map<string, Sprite> = new Map();
  private enemyTexture: RenderTexture | null = null;
  private logger: LogCollector;
  private debugMode: boolean = false;
  private config: GameConfig | null = null;
  private debugGraphics: Graphics | null = null;

  constructor() {
    this.logger = LogCollector.getInstance();
  }

  async initialize(config: GameConfig, pixiService: PixiService): Promise<void> {
    this.config = config;
    const app = pixiService.getApp();
    if (!app) {
      throw new Error('PixiJS 应用实例未初始化');
    }
    this.app = app;

    this.logger.addLog('EnemyRenderer', '初始化敌机渲染器', {
      width: config.canvas.width,
      height: config.canvas.height
    });

    // 创建主容器
    this.container = new Container();
    app.stage.addChild(this.container);

    // 创建敌机纹理
    this.createEnemyTexture();
  }

  private createEnemyTexture(): void {
    if (!this.app || !this.config) return;

    // 创建敌机纹理
    const graphics = new Graphics();
    
    // 绘制敌机形状
    graphics.lineStyle(2, 0xff0000);
    graphics.beginFill(0xff0000);
    
    // 绘制三角形
    graphics.moveTo(15, 0);
    graphics.lineTo(30, 30);
    graphics.lineTo(0, 30);
    graphics.closePath();
    graphics.endFill();

    // 生成纹理
    this.enemyTexture = RenderTexture.create({ width: 30, height: 30 });
    this.app.renderer.render(graphics, { renderTexture: this.enemyTexture });
    graphics.destroy();
  }

  public render(state: GameState): void {
    if (!this.container || !this.enemyTexture) return;

    if (state.enemies) {
      // 更新或创建敌机精灵
      state.enemies.forEach((enemy) => {
        let enemySprite = this.enemySprites.get(enemy.id);
        
        if (!enemySprite) {
          // 创建新的敌机精灵
          enemySprite = new Sprite(this.enemyTexture!);
          enemySprite.anchor.set(0.5);
          enemySprite.position.set(enemy.position.x, enemy.position.y);
          
          this.container!.addChild(enemySprite);
          this.enemySprites.set(enemy.id, enemySprite);
          
          this.logger.addLog('EnemyRenderer', '创建敌机精灵', {
            id: enemy.id,
            position: enemy.position
          });
        }

        // 更新敌机位置
        enemySprite.position.set(enemy.position.x, enemy.position.y);

        // 更新旋转
        if (enemy.rotation !== undefined) {
          enemySprite.rotation = enemy.rotation;
        }

        // 更新缩放
        if (enemy.scale) {
          enemySprite.scale.set(enemy.scale.x, enemy.scale.y);
        }

        // 调试模式下显示额外信息
        if (this.debugMode) {
          this.updateDebugGraphics();
          this.logger.addLog('EnemyRenderer', '敌机状态', {
            id: enemy.id,
            position: enemy.position,
            rotation: enemy.rotation,
            scale: enemy.scale
          });
        }
      });

      // 清理已经不存在的敌机精灵
      this.enemySprites.forEach((sprite, id) => {
        if (!state.enemies.find(enemy => enemy.id === id)) {
          sprite.destroy();
          this.enemySprites.delete(id);
          this.logger.addLog('EnemyRenderer', '销毁敌机精灵', { id });
        }
      });
    }
  }

  private updateDebugGraphics(): void {
    if (!this.debugGraphics) {
      this.debugGraphics = new Graphics();
      this.container?.addChild(this.debugGraphics);
    }

    this.debugGraphics.clear();
    this.debugGraphics.lineStyle(1, 0xff0000);
    
    // 为每个敌机绘制边界框和中心点
    this.enemySprites.forEach((sprite) => {
      const bounds = sprite.getBounds();
      this.debugGraphics!.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
      
      // 绘制中心点
      this.debugGraphics!.lineStyle(1, 0x00ff00);
      const center = sprite.position;
      this.debugGraphics!.moveTo(center.x - 5, center.y);
      this.debugGraphics!.lineTo(center.x + 5, center.y);
      this.debugGraphics!.moveTo(center.x, center.y - 5);
      this.debugGraphics!.lineTo(center.x, center.y + 5);
    });
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
      drawCalls: this.enemySprites.size,
      entities: this.enemySprites.size
    };
  }

  public destroy(): void {
    this.enemySprites.forEach((sprite) => {
      sprite.destroy();
    });
    this.enemySprites.clear();
    
    if (this.enemyTexture) {
      this.enemyTexture.destroy();
      this.enemyTexture = null;
    }
    
    if (this.debugGraphics) {
      this.debugGraphics.destroy();
      this.debugGraphics = null;
    }
    
    this.logger.addLog('EnemyRenderer', '销毁所有敌机精灵');
    this.container = null;
    this.app = null;
  }
} 