import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StateManager } from '../StateManager';
import { GameState, GameConfig } from '../../types';

describe('StateManager', () => {
  let stateManager: StateManager;
  const testPlayerId = 'test-player-1';

  beforeEach(() => {
    stateManager = new StateManager(testPlayerId);
  });

  describe('初始化', () => {
    it('应该正确创建初始状态', () => {
      const state = stateManager.getState();
      expect(state.player.id).toBe(testPlayerId);
      expect(state.status).toBe('init');
      expect(state.enemies).toEqual([]);
      expect(state.bullets).toEqual([]);
    });

    it('应该能够使用自定义配置初始化状态', () => {
      const customConfig: GameConfig = {
        canvas: {
          width: 800,
          height: 600,
          backgroundColor: '#000000'
        },
        player: {
          initialHealth: 200,
          lives: 3,
          speed: 10,
          size: { width: 32, height: 32 },
          fireRate: 300,
          invincibleDuration: 2000,
          hitboxSize: { width: 24, height: 24 },
          respawnDelay: 1000,
          respawnPosition: { x: 400, y: 500 }
        },
        weapons: {
          fireRate: 300,
          bulletSpeed: 10,
          bulletDamage: 20,
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
            frequency: 0.1,
            maxCount: 3,
            probability: {
              health: 0.4,
              speed: 0.2,
              fireRate: 0.2,
              damage: 0.1,
              shield: 0.1
            }
          }
        },
        rules: {
          difficultyLevel: 'hard',
          scoring: {
            baseScore: 100,
            multiplier: 1,
            combo: {
              timeWindow: 5000,
              multiplier: 1.1
            }
          },
          progression: {
            levelUpScore: 1000,
            difficultyIncrease: {
              enemyHealth: 1.2,
              enemySpeed: 1.1,
              spawnRate: 1.2
            }
          },
          boundaryPadding: 20,
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
            music: 0.6
          },
          sounds: {}
        },
        debug: {
          enabled: false
        }
      };

      stateManager.initializeState(customConfig);
      const state = stateManager.getState();
      expect(state.player.health).toBe(200);
      expect(state.player.speed).toBe(10);
      expect(state.player.fireRate).toBe(300);
    });
  });

  describe('游戏状态控制', () => {
    it('应该能够正确开始游戏', () => {
      stateManager.startGame();
      expect(stateManager.getState().status).toBe('playing');
    });

    it('应该能够正确暂停游戏', () => {
      stateManager.startGame();
      stateManager.pauseGame();
      const state = stateManager.getState();
      expect(state.status).toBe('paused');
      expect(state.isPaused).toBe(true);
    });

    it('应该能够正确恢复游戏', () => {
      stateManager.startGame();
      stateManager.pauseGame();
      stateManager.resumeGame();
      const state = stateManager.getState();
      expect(state.status).toBe('playing');
      expect(state.isPaused).toBe(false);
    });

    it('应该能够正确结束游戏', () => {
      stateManager.startGame();
      stateManager.setGameOver();
      const state = stateManager.getState();
      expect(state.status).toBe('gameOver');
      expect(state.isGameOver).toBe(true);
    });
  });

  describe('状态订阅', () => {
    it('应该能够正确订阅状态变化', () => {
      const mockListener = vi.fn();
      const selector = (state: GameState) => state.player;

      stateManager.subscribe(selector, mockListener);
      stateManager.startGame();

      expect(mockListener).toHaveBeenCalled();
      const calledState = mockListener.mock.calls[0][0];
      expect(calledState.id).toBe(testPlayerId);
    });

    it('应该能够正确取消订阅', () => {
      const mockListener = vi.fn();
      const selector = (state: GameState) => state.player;

      const unsubscribe = stateManager.subscribe(selector, mockListener);
      unsubscribe();
      stateManager.startGame();

      expect(mockListener).not.toHaveBeenCalled();
    });
  });

  describe('性能和统计更新', () => {
    it('应该能够正确更新性能数据', () => {
      const deltaTime = 16.67; // 约60fps
      stateManager.updatePerformance(deltaTime);
      const state = stateManager.getState();
      
      expect(state.performance.fps).toBeCloseTo(1000 / deltaTime);
      expect(state.performance.frameTime).toBe(deltaTime);
      expect(state.performance.lastUpdate).toBeDefined();
    });

    it('应该能够正确更新游戏统计数据', () => {
      const newStats = {
        score: 1000,
        kills: 5,
        accuracy: 0.8,
      };

      stateManager.updateStats(newStats);
      const state = stateManager.getState();
      
      expect(state.stats.score).toBe(1000);
      expect(state.stats.kills).toBe(5);
      expect(state.stats.accuracy).toBe(0.8);
    });
  });
}); 