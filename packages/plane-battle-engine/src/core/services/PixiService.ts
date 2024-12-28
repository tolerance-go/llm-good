import * as PIXI from 'pixi.js';
import { GameConfig } from '../../types/config';
import { LogCollector } from '../../utils/LogCollector';

/**
 * @class PixiService
 * @description PixiJS渲染服务 - 负责管理PixiJS应用实例和底层渲染功能
 */
export class PixiService {
  private app: PIXI.Application | null = null;
  private logger: LogCollector;
  private mainContainer: PIXI.Container | null = null;

  constructor() {
    this.logger = LogCollector.getInstance();
    this.logger.addLog('PixiService', '初始化PixiJS服务');
  }

  /**
   * 初始化PixiJS应用实例
   */
  async initialize(config: GameConfig, container: HTMLElement): Promise<PIXI.Application> {
    this.logger.addLog('PixiService', '初始化PixiJS应用实例');

    // 使用新的初始化方法
    this.app = new PIXI.Application();
    
    await this.app.init({
      width: config.canvas.width,
      height: config.canvas.height,
      backgroundColor: config.canvas.backgroundColor,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    if (!this.app) {
      throw new Error('无法初始化PixiJS应用实例');
    }

    // 将PixiJS的canvas添加到容器中
    container.appendChild(this.app.canvas);

    // 创建主容器
    this.mainContainer = new PIXI.Container();
    this.app.stage.addChild(this.mainContainer);

    // 设置自适应缩放
    this.setupResizeHandler();

    return this.app;
  }

  /**
   * 设置自适应缩放处理
   */
  private setupResizeHandler(): void {
    const resize = () => {
      if (!this.app) return;

      const parent = this.app.canvas.parentElement;
      if (!parent) return;

      const { width, height } = parent.getBoundingClientRect();
      this.app.renderer.resize(width, height);

      // 保持比例缩放
      if (this.mainContainer) {
        const scale = Math.min(width / 800, height / 600); // 假设原始设计尺寸为 800x600
        this.mainContainer.scale.set(scale);
        this.mainContainer.position.set(
          (width - this.mainContainer.width) / 2,
          (height - this.mainContainer.height) / 2
        );
      }
    };

    window.addEventListener('resize', resize);
    resize(); // 初始调整
  }

  /**
   * 获取应用实例
   */
  getApp(): PIXI.Application | null {
    return this.app;
  }

  /**
   * 获取主容器
   */
  getMainContainer(): PIXI.Container | null {
    return this.mainContainer;
  }

  /**
   * 添加显示对象到主容器
   */
  addToStage(displayObject: PIXI.Container | PIXI.Sprite | PIXI.Graphics): void {
    if (this.mainContainer) {
      this.mainContainer.addChild(displayObject);
    }
  }

  /**
   * 从容器移除显示对象
   */
  removeFromStage(displayObject: PIXI.Container | PIXI.Sprite | PIXI.Graphics): void {
    if (this.mainContainer) {
      this.mainContainer.removeChild(displayObject);
    }
  }

  /**
   * 销毁服务
   */
  destroy(): void {
    if (this.app) {
      window.removeEventListener('resize', this.setupResizeHandler);
      this.app.destroy(true, { children: true, texture: true });
      this.app = null;
    }
    this.mainContainer = null;
  }
} 