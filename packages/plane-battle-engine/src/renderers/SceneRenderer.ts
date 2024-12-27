import { GameRenderer, RenderStats } from '../types/renderers';
import { GameState } from '../types/state';
import { GameConfig } from '../types/config';
import { EnemyRenderer } from './EnemyRenderer';
import { PlayerRenderer } from './PlayerRenderer';

/**
 * @class SceneRenderer
 * @description 场景渲染器 - 负责整个游戏场景的渲染，包括玩家、敌人等所有游戏元素
 */
export class SceneRenderer implements GameRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private config: GameConfig | null = null;
  private debugMode: boolean = false;

  // 子渲染器
  private playerRenderer: PlayerRenderer;
  private enemyRenderer: EnemyRenderer;

  constructor() {
    this.playerRenderer = new PlayerRenderer();
    this.enemyRenderer = new EnemyRenderer();
  }

  initialize(config: GameConfig, canvas: HTMLCanvasElement): void {
    this.config = config;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    if (!this.context) {
      throw new Error('无法获取 Canvas 2D 上下文');
    }

    // 初始化子渲染器
    this.playerRenderer.initialize(config, canvas);
    this.enemyRenderer.initialize(config, canvas);
  }

  render(state: GameState): void {
    if (!this.context || !this.canvas || !this.config) return;

    // 清空画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制背景
    this.drawBackground();

    // 渲染游戏元素
    this.enemyRenderer.render(state);
    this.playerRenderer.render(state);

    // 调试信息
    if (this.debugMode) {
      this.drawDebugInfo();
    }
  }

  private drawBackground(): void {
    if (!this.context || !this.canvas) return;

    // 设置背景样式
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 可以在这里添加更多背景元素，比如星星、云等
  }

  private drawDebugInfo(): void {
    if (!this.context) return;

    this.context.save();
    this.context.fillStyle = '#ffffff';
    this.context.font = '12px Arial';
    
    // 显示实体数量
    const stats = this.getStats();
    this.context.fillText(`实体数量: ${stats.entities}`, 10, 40);
    
    this.context.restore();
  }

  setDebug(enabled: boolean): void {
    this.debugMode = enabled;
    this.playerRenderer.setDebug(enabled);
    this.enemyRenderer.setDebug(enabled);
  }

  getStats(): RenderStats {
    return {
      fps: 0, // 场景渲染器不直接管理 FPS
      drawCalls: 1, // 场景本身的绘制调用
      entities: 
        this.playerRenderer.getStats().entities +
        this.enemyRenderer.getStats().entities
    };
  }

  destroy(): void {
    this.playerRenderer.destroy();
    this.enemyRenderer.destroy();
    
    this.canvas = null;
    this.context = null;
    this.config = null;
  }
} 