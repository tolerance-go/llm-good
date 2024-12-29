import React, { useEffect, useRef } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { RenderService } from '../core/services/RenderService';
import { GameConfig } from '../types/config';
import { LogCollector } from '../utils/LogCollector';
import { PixiService } from '../core/services/PixiService';
import { StartButtonRenderer } from './renderers/StartButtonRenderer';

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

    logger.addLog('RenderServiceDemo', '开始初始化组件', {
      containerWidth: container.clientWidth,
      containerHeight: container.clientHeight
    });

    const initializeDemo = async () => {
      try {
        // 创建渲染服务实例
        const renderService = new RenderService(new PixiService());
        renderServiceRef.current = renderService;
        logger.addLog('RenderServiceDemo', '渲染服务创建完成');

        // 创建基本配置
        const config: GameConfig = {
          canvas: {
            width: 400,
            height: 300,
            backgroundColor: 0x000000,
          },
          debug: {
            enabled: false,
            showFPS: false,
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
            enabled: false,
            volume: {
              master: 1,
              sfx: 0.8,
              music: 0.5
            },
            sounds: {}
          }
        };

        // 初始化渲染服务
        await renderService.initialize(config, container);

        const app = renderService.getApp();
        logger.addLog('RenderServiceDemo', '渲染服务初始化完成', {
          hasApp: !!app,
          appWidth: app?.screen.width,
          appHeight: app?.screen.height
        });

        // 创建并注册按钮渲染器
        const buttonRenderer = new StartButtonRenderer();
        renderService.registerRenderer(buttonRenderer);
        logger.addLog('RenderServiceDemo', '按钮渲染器注册完成');

        logger.addLog('RenderServiceDemo', '初始渲染完成');

      } catch (error) {
        logger.addLog('RenderServiceDemo', '初始化失败', { error });
        console.error('渲染服务初始化失败:', error);
      }
    };

    initializeDemo();

    return () => {
      logger.addLog('RenderServiceDemo', '开始清理资源');
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