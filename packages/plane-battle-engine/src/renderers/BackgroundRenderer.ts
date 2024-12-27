import { Container, TilingSprite, Graphics, RenderTexture, Application } from 'pixi.js';
import { LogCollector } from '../utils/LogCollector';
import { GameRenderer, RenderStats } from '../types/renderers';
import { GameConfig } from '../types/config';

export class BackgroundRenderer implements GameRenderer {
  private container: Container | null = null;
  private app: Application | null = null;
  private background: TilingSprite | null = null;
  private scrollSpeed: number = 2;
  private logger: LogCollector;
  private config: GameConfig | null = null;
  private debugMode: boolean = false;

  constructor() {
    this.logger = LogCollector.getInstance();
  }

  public initialize(config: GameConfig, canvas: HTMLCanvasElement): void {
    this.config = config;
    this.logger.addLog('BackgroundRenderer', '初始化背景渲染器', {
      width: canvas.width,
      height: canvas.height
    });
  }

  setContainer(container: Container, app: Application): void {
    this.container = container;
    this.app = app;
    this.createBackground();
  }

  private createBackground(): void {
    if (!this.container || !this.app || !this.config) {
      this.logger.addLog('BackgroundRenderer', '容器或配置未初始化，无法创建背景');
      return;
    }

    // 如果已存在背景，先销毁
    if (this.background) {
      this.background.destroy();
    }

    // 创建背景纹理
    const graphics = new Graphics();
    graphics.beginFill(0x000033);
    graphics.drawRect(0, 0, this.config.canvas.width, this.config.canvas.height);
    graphics.endFill();
    
    // 添加渐变效果
    graphics.beginFill(0x000066, 0.5);
    graphics.drawRect(0, this.config.canvas.height / 2, this.config.canvas.width, this.config.canvas.height / 2);
    graphics.endFill();
    
    // 添加一些星星点缀
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * this.config.canvas.width;
      const y = Math.random() * this.config.canvas.height;
      const size = Math.random() * 2 + 1;
      graphics.beginFill(0xffffff, Math.random() * 0.5 + 0.5);
      graphics.drawCircle(x, y, size);
      graphics.endFill();
    }
    
    // 创建渲染纹理
    const texture = RenderTexture.create({
      width: this.config.canvas.width,
      height: this.config.canvas.height
    });
    this.app.renderer.render(graphics, { renderTexture: texture });
    graphics.destroy();

    // 创建平铺精灵
    this.background = new TilingSprite(
      texture,
      this.config.canvas.width,
      this.config.canvas.height * 2 // 高度翻倍以实现无缝滚动
    );

    // 设置位置
    this.background.position.set(0, 0);
    
    // 添加到容器
    this.container.addChild(this.background);
    
    this.logger.addLog('BackgroundRenderer', '背景创建完成', {
      width: this.config.canvas.width,
      height: this.config.canvas.height
    });
  }

  public render(): void {
    if (!this.background) return;

    // 更新背景滚动
    this.background.tilePosition.y += this.scrollSpeed;

    // 当滚动超过一个屏幕高度时重置
    if (this.background.tilePosition.y >= this.config!.canvas.height) {
      this.background.tilePosition.y = 0;
    }

    if (this.debugMode) {
      this.logger.addLog('BackgroundRenderer', '背景滚动更新', {
        tilePositionY: this.background.tilePosition.y,
        scrollSpeed: this.scrollSpeed
      });
    }
  }

  public setScrollSpeed(speed: number): void {
    this.scrollSpeed = speed;
    this.logger.addLog('BackgroundRenderer', '更新滚动速度', { speed });
  }

  public getStats(): RenderStats {
    return {
      fps: 0,
      drawCalls: this.background ? 1 : 0,
      entities: this.background ? 1 : 0
    };
  }

  public setDebug(enabled: boolean): void {
    this.debugMode = enabled;
  }

  public destroy(): void {
    if (this.background) {
      this.background.destroy({ children: true, texture: true });
      this.background = null;
    }
    
    this.container = null;
    this.app = null;
    this.logger.addLog('BackgroundRenderer', '销毁背景');
  }
} 