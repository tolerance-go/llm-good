import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef } from 'react';
import { RenderService } from '../../core/services/RenderService';
import { PlayerRenderer } from '../../renderers/PlayerRenderer';
import { PixiService } from '../../core/services/PixiService';
import { GameState } from '../../types/state';
import { GameConfig } from '../../types/config';

const meta: Meta = {
  title: '渲染器/玩家渲染器',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

// 创建基础的游戏状态
const createGameState = (position: { x: number, y: number }): GameState => ({
  status: 'playing',
  currentLevel: 1,
  currentWave: 1,
  score: 0,
  time: 0,
  isPaused: false,
  isGameOver: false,
  player: {
    id: 'player-1',
    position,
    rotation: 0,
    scale: { x: 1, y: 1 },
    health: 100,
    lives: 3,
    size: { width: 30, height: 30 },
    speed: 5,
    score: 0,
    fireRate: 5,
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
      bulletSpeed: 10,
      bulletDamage: 1
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
});

// 创建基础配置
const config: GameConfig = {
  canvas: {
    width: 800,
    height: 600,
    backgroundColor: 0x000000
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
    respawnPosition: { x: 400, y: 500 }
  },
  weapons: {
    fireRate: 0.5,
    bulletSpeed: 10,
    bulletDamage: 10,
    bulletSize: { width: 8, height: 8 }
  },
  enemies: {
    types: {
      small: {
        health: 10,
        speed: 3,
        size: { width: 24, height: 24 },
        score: 100,
        damage: 10
      }
    },
    spawn: {
      rate: 1,
      maxCount: 10,
      patterns: {
        basic: {
          enemyTypes: ['small'],
          frequency: 1,
          count: 1
        }
      }
    }
  },
  powerups: {
    types: {
      health: { value: 50 },
      speed: { multiplier: 1.5, duration: 5000 },
      fireRate: { multiplier: 2, duration: 5000 },
      damage: { multiplier: 2, duration: 5000 },
      shield: { duration: 10000 }
    },
    spawn: {
      frequency: 0.1,
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
        multiplier: 0.1
      }
    },
    progression: {
      levelUpScore: 1000,
      wavesPerLevel: 3,
      difficultyIncrease: {
        enemyHealth: 1.2,
        enemySpeed: 1.1,
        spawnRate: 1.2
      }
    },
    boundaryPadding: 10,
    wrap: false,
    scoreMultiplier: 1,
    enemySpawnRate: 1,
    powerUpFrequency: 0.1
  },
  audio: {
    enabled: true,
    volume: {
      master: 1,
      sfx: 0.8,
      music: 0.5
    },
    sounds: {
      shoot: {
        src: '/sounds/shoot.mp3',
        volume: 0.5
      },
      explosion: {
        src: '/sounds/explosion.mp3',
        volume: 0.6
      }
    }
  },
  debug: {
    enabled: false,
    showHitboxes: false,
    showFPS: false
  }
};

// 渲染组件
const RenderComponent = ({ state }: { state: GameState }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<RenderService | null>(null);

  useEffect(() => {
    const init = async () => {
      if (containerRef.current && !serviceRef.current) {
        const pixiService = new PixiService();
        const renderService = new RenderService(pixiService);
        const playerRenderer = new PlayerRenderer();
        
        // 启用调试模式
        playerRenderer.setDebug(true);
        
        renderService.registerRenderer(playerRenderer);
        await renderService.initialize(config, containerRef.current);
        
        // 初始化渲染器时传入初始状态
        await playerRenderer.initialize(config, pixiService, state);
        
        serviceRef.current = renderService;
      }
    };
    
    init();

    return () => {
      if (serviceRef.current) {
        serviceRef.current.destroy();
        serviceRef.current = null;
      }
    };
  }, [state]); // 添加 state 依赖

  useEffect(() => {
    if (serviceRef.current) {
      serviceRef.current.render(state);
    }
  }, [state]);

  return (
    <div>
      <div ref={containerRef} style={{ width: '800px', height: '600px', border: '1px solid #ccc' }} />
      <div style={{ padding: '10px', background: '#f0f0f0', marginTop: '10px' }}>
        <h3>玩家位置信息</h3>
        <pre>
          {JSON.stringify(state.player.position, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// 中心位置的故事
export const Center: Story = {
  render: () => <RenderComponent state={createGameState({ x: 400, y: 300 })} />,
};

// 左上角位置的故事
export const TopLeft: Story = {
  render: () => <RenderComponent state={createGameState({ x: 50, y: 50 })} />,
};

// 右上角位置的故事
export const TopRight: Story = {
  render: () => <RenderComponent state={createGameState({ x: 750, y: 50 })} />,
};

// 左下角位置的故事
export const BottomLeft: Story = {
  render: () => <RenderComponent state={createGameState({ x: 50, y: 550 })} />,
};

// 右下角位置的故事
export const BottomRight: Story = {
  render: () => <RenderComponent state={createGameState({ x: 750, y: 550 })} />,
}; 