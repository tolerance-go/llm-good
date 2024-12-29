/**
 * @class RenderService
 * @description 渲染服务 - 负责管理和协调所有渲染器
 * 
 * @responsibility
 * - 初始化和管理 PixiJS 应用实例
 * - 提供渲染器注册接口
 * - 协调渲染流程
 * - 处理渲染性能统计
 * - 提供调试视图支持
 * - 处理输入事件
 * 
 * @dependencies
 * - GameRenderer: 渲染器接口
 * - GameState: 游戏状态
 * - GameConfig: 游戏配置
 * - LogCollector: 日志收集器
 */

import { GameRenderer, RenderStats, PlayerInput } from '../../types/renderers';
import { GameState } from '../../types/state';
import { GameConfig } from '../../types/config';
import { LogCollector } from '../../utils/LogCollector';
import { Application } from 'pixi.js';
import { PixiService } from './PixiService';

export class RenderService {
  private gameState: GameState | null = null;
  private config: GameConfig | null = null;
  private logger: LogCollector;
  private debugMode: boolean = false;
  private lastRenderTime: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;
  private renderers: Set<GameRenderer> = new Set();
  private inputHandlers: Array<(input: PlayerInput) => void> = [];
  private lastLogTime: number = 0;
  private logUpdateInterval: number = 1000;
  private pixiService: PixiService;

  constructor(pixiService: PixiService) {
    this.logger = LogCollector.getInstance();
    this.logger.addLog('RenderService', '初始化渲染服务');
    this.pixiService = pixiService;
  }

  async initialize(config: GameConfig, container: HTMLElement): Promise<void> {
    this.logger.addLog('RenderService', '初始化渲染服务', { width: config.canvas.width, height: config.canvas.height });
    this.config = config;

    // 使用 PixiService 初始化应用实例
    await this.pixiService.initialize(config, container);
    
    // 创建初始状态
    const initialState: GameState = {
      status: 'playing',
      currentLevel: 1,
      currentWave: 1,
      score: 0,
      time: 0,
      isPaused: false,
      isGameOver: false,
      player: {
        id: 'player-1',
        position: {
          x: config.canvas.width / 2,
          y: config.canvas.height - 100
        },
        rotation: 0,
        scale: { x: 1, y: 1 },
        health: config.player.initialHealth,
        lives: config.player.lives,
        size: config.player.size,
        speed: config.player.speed,
        score: 0,
        fireRate: config.player.fireRate,
        lastFireTime: 0,
        powerups: [],
        invincible: false,
        respawning: false,
        velocity: { x: 0, y: 0 },
        active: true,
        combo: {
          count: 0,
          timer: 0,
          multiplier: 1
        },
        weapons: {
          bulletSpeed: config.weapons.bulletSpeed,
          bulletDamage: config.weapons.bulletDamage
        }
      },
      enemies: [],
      bullets: [],
      powerups: [],
      input: {
        type: 'move',
        data: {
          x: 0,
          y: 0,
          pressed: false
        },
        keyboard: {
          up: false,
          down: false,
          left: false,
          right: false,
          space: false
        }
      },
      performance: {
        fps: 60,
        frameTime: 16.67,
        updateTime: 0,
        renderTime: 0
      },
      ui: {
        currentScreen: 'game',
        elements: {
          mainMenu: false,
          startButton: false,
          optionsButton: false,
          scoreDisplay: true,
          pauseMenu: false,
          gameOverScreen: false
        }
      }
    };
    
    // 初始化所有渲染器
    for (const renderer of this.renderers) {
      if (this.config) {
        await renderer.initialize(this.config, this.pixiService, initialState);
        this.logger.addLog('RenderService', '渲染器初始化完成', { 
          rendererType: renderer.constructor.name
        });
      }
    }
  }

  registerRenderer(renderer: GameRenderer): void {
    this.logger.addLog('RenderService', '注册新渲染器', { rendererType: renderer.constructor.name });
    this.renderers.add(renderer);
    if (this.config && this.pixiService.getApp()) {
      // 创建初始状态
      const initialState: GameState = {
        status: 'playing',
        currentLevel: 1,
        currentWave: 1,
        score: 0,
        time: 0,
        isPaused: false,
        isGameOver: false,
        player: {
          id: 'player-1',
          position: {
            x: this.config.canvas.width / 2,
            y: this.config.canvas.height - 100
          },
          rotation: 0,
          scale: { x: 1, y: 1 },
          health: this.config.player.initialHealth,
          lives: this.config.player.lives,
          size: this.config.player.size,
          speed: this.config.player.speed,
          score: 0,
          fireRate: this.config.player.fireRate,
          lastFireTime: 0,
          powerups: [],
          invincible: false,
          respawning: false,
          velocity: { x: 0, y: 0 },
          active: true,
          combo: {
            count: 0,
            timer: 0,
            multiplier: 1
          },
          weapons: {
            bulletSpeed: this.config.weapons.bulletSpeed,
            bulletDamage: this.config.weapons.bulletDamage
          }
        },
        enemies: [],
        bullets: [],
        powerups: [],
        input: {
          type: 'move',
          data: {
            x: 0,
            y: 0,
            pressed: false
          },
          keyboard: {
            up: false,
            down: false,
            left: false,
            right: false,
            space: false
          }
        },
        performance: {
          fps: 60,
          frameTime: 16.67,
          updateTime: 0,
          renderTime: 0
        },
        ui: {
          currentScreen: 'game',
          elements: {
            mainMenu: false,
            startButton: false,
            optionsButton: false,
            scoreDisplay: true,
            pauseMenu: false,
            gameOverScreen: false
          }
        }
      };
      renderer.initialize(this.config, this.pixiService, initialState);
      this.logger.addLog('RenderService', '渲染器初始化完成', { 
        rendererType: renderer.constructor.name
      });
    }
  }

  // 移除渲染器
  unregisterRenderer(renderer: GameRenderer): void {
    this.renderers.delete(renderer);
  }

  // 注册输入处理器
  onInput(handler: (input: PlayerInput) => void): void {
    this.inputHandlers.push(handler);
  }

  // 触发输入事件
  private triggerInput(input: PlayerInput): void {
    this.inputHandlers.forEach(handler => handler(input));
  }

  render(state: GameState): void {
    if (!this.pixiService.getApp()) {
      this.logger.addLog('RenderService', '渲染失败：应用实例未初始化');
      return;
    }

    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime - this.lastRenderTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastRenderTime = currentTime;
      
      this.logger.addLog('RenderService', '性能统计', { fps: this.fps });
    }

    // 调用所有注册的渲染器进行渲染
    for (const renderer of this.renderers) {
      if (currentTime - this.lastLogTime >= this.logUpdateInterval) {
        this.logger.addLog('RenderService', '调用渲染器', { rendererType: renderer.constructor.name });
      }
      renderer.render(state);
    }

    // 更新最后日志时间
    if (currentTime - this.lastLogTime >= this.logUpdateInterval) {
      this.lastLogTime = currentTime;
    }
  }

  setDebug(enabled: boolean): void {
    this.debugMode = enabled;
    this.renderers.forEach(renderer => renderer.setDebug(enabled));
  }

  getStats(): RenderStats {
    return {
      fps: this.fps,
      drawCalls: this.frameCount,
      entities: Array.from(this.renderers).reduce((total: number, renderer: GameRenderer) => total + renderer.getStats().entities, 0)
    };
  }

  getApp(): Application | null {
    return this.pixiService.getApp();
  }

  destroy(): void {
    this.renderers.forEach(renderer => renderer.destroy());
    this.renderers = new Set();
    
    this.pixiService.destroy();
    
    this.gameState = null;
    this.config = null;
    this.inputHandlers = [];
  }
} 