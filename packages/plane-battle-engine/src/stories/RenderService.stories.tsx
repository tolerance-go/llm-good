import React, { useEffect, useRef } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import * as PIXI from 'pixi.js';
import { RenderService } from '../core/services/RenderService';
import { GameRenderer } from '../types/renderers';
import { GameState } from '../types/state';
import { GameConfig } from '../types/config';
import { LogCollector } from '../utils/LogCollector';

// 创建一个按钮渲染器
class StartButtonRenderer implements GameRenderer {
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
    
    // 使用新的 Text 创建方式
    this.buttonText = new PIXI.Text({
      text: '开始游戏',
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
      }
    });

    this.buttonText.anchor.set(0.5);
    
    this.button.addChild(this.background);
    this.button.addChild(this.buttonText);
    this.container.addChild(this.button);

    // 使用新的交互属性
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

  async initialize(config: GameConfig, canvas: HTMLCanvasElement): Promise<void> {
    this.logger.addLog('StartButtonRenderer', '初始化开始', {
      canvasExists: !!canvas,
      canvasWidth: canvas?.width,
      canvasHeight: canvas?.height
    });

    // 等待 canvas 准备就绪
    if (!canvas) {
      throw new Error('Canvas is not initialized');
    }

    // 使用新的绘图 API
    this.background.clear();
    this.background.beginFill(0x3498db);
    this.background.drawRoundedRect(-75, -25, 150, 50, 10);
    this.background.endFill();

    // 设置按钮位置
    this.button.position.set(config.canvas.width / 2, config.canvas.height / 2);
    
    // 确保文本位于按钮中心
    this.buttonText.position.set(0, 0);

    this.logger.addLog('StartButtonRenderer', '初始化完成', {
      buttonX: this.button.x,
      buttonY: this.button.y
    });
  }

  render(state: GameState): void {
    // 可以根据游戏状态更新按钮的显示
    this.button.visible = state.status !== 'playing';
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

  getContainer(): PIXI.Container {
    return this.container;
  }
}

// 创建一个包装组件来展示渲染服务
const RenderServiceDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderServiceRef = useRef<RenderService | null>(null);
  const logger = LogCollector.getInstance();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      logger.addLog('RenderServiceDemo', '容器元素未找到');
      return;
    }

    const config: GameConfig = {
      canvas: {
        width: 400,
        height: 300,
        backgroundColor: 0x000000,
      },
      debug: {
        enabled: true,
        showFPS: true,
      },
      player: {
        initialHealth: 100,
        lives: 3,
        speed: 5,
        size: { width: 32, height: 32 },
        fireRate: 0.5,
        invincibleDuration: 2000,
        hitboxSize: { width: 24, height: 24 },
        respawnDelay: 1000,
        respawnPosition: { x: 200, y: 250 }
      },
      weapons: {
        fireRate: 0.5,
        bulletSpeed: 10,
        bulletDamage: 10,
        bulletSize: { width: 8, height: 8 }
      },
      enemies: {
        types: {
          basic: {
            health: 50,
            speed: 3,
            size: { width: 32, height: 32 },
            score: 100,
            damage: 10
          }
        },
        spawn: {
          rate: 1,
          maxCount: 10,
          patterns: {
            basic: {
              enemyTypes: ['basic'],
              frequency: 1,
              count: 1
            }
          }
        }
      },
      powerups: {
        types: {
          health: { value: 20 },
          speed: { multiplier: 1.5, duration: 5000 },
          fireRate: { multiplier: 2, duration: 5000 },
          damage: { multiplier: 2, duration: 5000 },
          shield: { duration: 5000 }
        },
        spawn: {
          frequency: 0.2,
          maxCount: 3,
          probability: {
            health: 0.3,
            speed: 0.2,
            fireRate: 0.2,
            damage: 0.2,
            shield: 0.1
          }
        }
      },
      rules: {
        difficultyLevel: 'normal',
        scoring: {
          baseScore: 100,
          multiplier: 1,
          combo: {
            timeWindow: 2000,
            multiplier: 1.1
          }
        },
        progression: {
          levelUpScore: 1000,
          wavesPerLevel: 1,
          difficultyIncrease: {
            enemyHealth: 1.1,
            enemySpeed: 1.05,
            spawnRate: 1.1
          }
        },
        boundaryPadding: 10,
        wrap: false,
        scoreMultiplier: 1,
        enemySpawnRate: 1,
        powerUpFrequency: 0.2
      },
      audio: {
        enabled: true,
        volume: {
          master: 1,
          sfx: 0.8,
          music: 0.5
        },
        sounds: {}
      }
    };

    let animationFrameId: number;

    const initializeGame = async () => {
      try {
        logger.addLog('RenderServiceDemo', '开始初始化游戏');

        // 创建渲染服务实例
        const renderService = new RenderService();
        renderServiceRef.current = renderService;

        // 等待渲染服务初始化完成
        await renderService.initialize(config, container);
        logger.addLog('RenderServiceDemo', '渲染服务初始化完成');

        // 创建按钮渲染器
        const buttonRenderer = new StartButtonRenderer();
        
        // 先初始化按钮渲染器
        await buttonRenderer.initialize(config, renderService.getApp()!.canvas);
        
        // 获取 PixiService 实例
        const pixiApp = renderService.getApp();
        if (!pixiApp) {
          throw new Error('PixiJS application not initialized');
        }

        // 将按钮容器添加到舞台
        pixiApp.stage.addChild(buttonRenderer.getContainer());
        
        // 注册渲染器
        renderService.registerRenderer(buttonRenderer);
        logger.addLog('RenderServiceDemo', '按钮渲染器注册完成');

        // 开始渲染循环
        const gameLoop = () => {
          if (renderService) {
            renderService.render({
              status: 'menu',
              currentLevel: 1,
              currentWave: 1,
              score: 0,
              time: Date.now(),
              isPaused: false,
              isGameOver: false,
              player: {
                id: 'player1',
                position: { x: 0, y: 0 },
                velocity: { x: 0, y: 0 },
                rotation: 0,
                scale: { x: 1, y: 1 },
                health: 100,
                lives: 3,
                size: { width: 32, height: 32 },
                speed: 5,
                score: 0,
                fireRate: 0.5,
                lastFireTime: 0,
                powerups: [],
                invincible: false,
                respawning: false,
                active: true,
                combo: {
                  count: 0,
                  timer: 0,
                  multiplier: 1
                },
                weapons: {
                  bulletSpeed: 10,
                  bulletDamage: 10
                }
              },
              enemies: [],
              bullets: [],
              powerups: [],
              input: {
                type: 'move',
                data: { x: 0, y: 0 },
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
                updateTime: 1,
                renderTime: 1
              },
              ui: {
                currentScreen: 'menu',
                elements: {
                  mainMenu: true,
                  startButton: true,
                  optionsButton: false,
                  scoreDisplay: false,
                  pauseMenu: false,
                  gameOverScreen: false
                }
              }
            });
          }
          animationFrameId = requestAnimationFrame(gameLoop);
        };

        gameLoop();
        logger.addLog('RenderServiceDemo', '游戏循环启动');
      } catch (error) {
        logger.addLog('RenderServiceDemo', '初始化失败', { error });
        console.error('渲染服务初始化失败:', error);
      }
    };

    initializeGame();

    return () => {
      logger.addLog('RenderServiceDemo', '开始清理资源');
      cancelAnimationFrame(animationFrameId);
      if (renderServiceRef.current) {
        renderServiceRef.current.destroy();
      }
      logger.addLog('RenderServiceDemo', '资源清理完成');
    };
  }, []);

  return (
    <div style={{ width: '400px', height: '300px', background: '#000', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute' }} />
    </div>
  );
};

const meta: Meta = {
  title: '渲染系统/RenderService',
  component: RenderServiceDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '这是一个演示渲染服务基本功能的示例，展示了如何创建一个交互式的开始游戏按钮。'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof RenderServiceDemo>;

// 基本示例
export const Basic: Story = {
  name: '开始游戏按钮示例',
  parameters: {
    docs: {
      description: {
        story: '展示了一个交互式的开始游戏按钮，包含悬停和点击效果。'
      }
    }
  }
}; 