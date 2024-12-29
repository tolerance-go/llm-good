import { Container, Application } from 'pixi.js';
import { GameRenderer, RenderStats } from '../types/renderers';
import { GameState } from '../types/state';
import { GameConfig } from '../types/config';
import { EnemyRenderer } from './EnemyRenderer';
import { PlayerRenderer } from './PlayerRenderer';
import { PixiService } from '../core/services/PixiService';

/**
 * @class SceneRenderer
 * @description 场景渲染器 - 负责整个游戏场景的渲染，包括玩家、敌人等所有游戏元素
 */
export class SceneRenderer implements GameRenderer {
  private container: Container | null = null;
  private app: Application | null = null;
  private config: GameConfig | null = null;
  private debugMode: boolean = false;

  // 子渲染器
  private playerRenderer: PlayerRenderer;
  private enemyRenderer: EnemyRenderer;

  constructor() {
    this.playerRenderer = new PlayerRenderer();
    this.enemyRenderer = new EnemyRenderer();
  }

  async initialize(config: GameConfig, pixiService: PixiService): Promise<void> {
    this.config = config;
    const app = pixiService.getApp();
    if (!app) {
      throw new Error('PixiJS 应用实例未初始化');
    }
    this.app = app;

    // 创建主容器
    this.container = new Container();
    app.stage.addChild(this.container);

    // 初始化子渲染器
    await Promise.all([
      this.playerRenderer.initialize(config, pixiService),
      this.enemyRenderer.initialize(config, pixiService)
    ]);
  }

  render(state: GameState): void {
    if (!this.container || !this.app || !this.config) return;

    // 渲染游戏元素
    this.enemyRenderer.render(state);
    this.playerRenderer.render(state);

    // 调试信息
    if (this.debugMode) {
      this.drawDebugInfo();
    }
  }

  private drawDebugInfo(): void {
    // 在这里添加调试信息的绘制逻辑
  }

  setDebug(enabled: boolean): void {
    this.debugMode = enabled;
    this.playerRenderer.setDebug(enabled);
    this.enemyRenderer.setDebug(enabled);
  }

  getStats(): RenderStats {
    return {
      fps: 0,
      drawCalls: 
        this.playerRenderer.getStats().drawCalls +
        this.enemyRenderer.getStats().drawCalls,
      entities: 
        this.playerRenderer.getStats().entities +
        this.enemyRenderer.getStats().entities
    };
  }

  destroy(): void {
    this.playerRenderer.destroy();
    this.enemyRenderer.destroy();
    
    this.container = null;
    this.app = null;
    this.config = null;
  }
} 