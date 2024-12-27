import { describe, it, expect, beforeEach } from 'vitest';
import { EnemyStateManager } from '../EnemyStateManager';
import { GameConfig, Vector2D } from '../../types';

describe('EnemyStateManager', () => {
  let enemyManager: EnemyStateManager;
  const defaultConfig: GameConfig = {
    canvas: {
      width: 800,
      height: 600,
      backgroundColor: '#000000'
    },
    player: {
      initialHealth: 100,
      lives: 3,
      speed: 5,
      size: { width: 32, height: 32 },
      fireRate: 2,
      invincibleDuration: 2000,
      hitboxSize: { width: 24, height: 24 },
      respawnDelay: 1000,
      respawnPosition: { x: 400, y: 500 }
    },
    weapons: {
      fireRate: 2,
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
        },
        elite: {
          health: 100,
          speed: 2,
          size: { width: 48, height: 48 },
          score: 200,
          damage: 20
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
      difficultyLevel: 'normal',
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

  beforeEach(() => {
    enemyManager = new EnemyStateManager(defaultConfig);
  });

  describe('敌人创建', () => {
    it('应该能够正确创建基础敌人', () => {
      const position: Vector2D = { x: 100, y: 0 };
      const enemy = enemyManager.createEnemy(position, 'basic');

      expect(enemy.position).toEqual(position);
      expect(enemy.type).toBe('basic');
      expect(enemy.health).toBe(defaultConfig.enemies.types.basic.health);
      expect(enemy.speed).toBe(defaultConfig.enemies.types.basic.speed);
      expect(enemy.size).toEqual(defaultConfig.enemies.types.basic.size);
      expect(enemy.damage).toBe(defaultConfig.enemies.types.basic.damage);
      expect(enemy.scoreValue).toBe(defaultConfig.enemies.types.basic.score);
      expect(enemy.active).toBe(true);
    });

    it('应该能够创建不同类型的敌人', () => {
      const position: Vector2D = { x: 100, y: 0 };
      const enemy = enemyManager.createEnemy(position, 'elite');

      expect(enemy.type).toBe('elite');
      expect(enemy.health).toBe(defaultConfig.enemies.types.elite.health);
      expect(enemy.speed).toBe(defaultConfig.enemies.types.elite.speed);
      expect(enemy.size).toEqual(defaultConfig.enemies.types.elite.size);
    });
  });

  describe('敌人管理', () => {
    it('应���能够添加和获取敌人', () => {
      const position: Vector2D = { x: 100, y: 0 };
      const enemy = enemyManager.createEnemy(position);
      
      enemyManager.addEnemy(enemy);
      const enemies = enemyManager.getEnemies();
      
      expect(enemies).toHaveLength(1);
      expect(enemies[0]).toEqual(enemy);
    });

    it('应该能够移除敌人', () => {
      const position: Vector2D = { x: 100, y: 0 };
      const enemy = enemyManager.createEnemy(position);
      
      enemyManager.addEnemy(enemy);
      enemyManager.removeEnemy(enemy.id);
      
      expect(enemyManager.getEnemies()).toHaveLength(0);
    });

    it('应该能够重置敌人状态', () => {
      const enemy = enemyManager.createEnemy({ x: 100, y: 0 });
      enemyManager.addEnemy(enemy);
      
      enemyManager.reset();
      expect(enemyManager.getEnemies()).toHaveLength(0);
    });
  });

  describe('敌人位置更新', () => {
    it('应该正确更新敌人位置', () => {
      const position: Vector2D = { x: 400, y: 0 };
      const enemy = enemyManager.createEnemy(position);
      enemyManager.addEnemy(enemy);

      const deltaTime = 1/60; // 模拟60fps
      enemyManager.updateEnemyPositions(deltaTime);

      const enemies = enemyManager.getEnemies();
      expect(enemies[0].position.y).toBeGreaterThan(position.y); // 敌人应该向下移动
    });

    it('应该移除超出画布的敌人', () => {
      // 创建一个位于画布底部的敌人
      const enemy1 = enemyManager.createEnemy({ x: 400, y: defaultConfig.canvas.height + 100 });
      const enemy2 = enemyManager.createEnemy({ x: 400, y: 0 });
      
      enemyManager.addEnemy(enemy1);
      enemyManager.addEnemy(enemy2);
      
      enemyManager.updateEnemyPositions(1/60);
      
      const enemies = enemyManager.getEnemies();
      expect(enemies).toHaveLength(1); // 只有一个敌人应该保留
      expect(enemies[0].id).toBe(enemy2.id);
    });
  });

  describe('敌人生成控制', () => {
    it('应该正确控制敌人数量上限', () => {
      // 添加最大数量的敌人
      for (let i = 0; i < defaultConfig.enemies.spawn.maxCount; i++) {
        const enemy = enemyManager.createEnemy({ x: 100, y: 0 });
        enemyManager.addEnemy(enemy);
      }

      expect(enemyManager.canSpawnEnemy()).toBe(false);

      // 移除一个敌人后应该可以生成新的敌人
      enemyManager.removeEnemy(enemyManager.getEnemies()[0].id);
      expect(enemyManager.canSpawnEnemy()).toBe(true);
    });
  });

  describe('配置更新', () => {
    it('应该能够更新配置', () => {
      const newConfig = {
        ...defaultConfig,
        enemies: {
          ...defaultConfig.enemies,
          types: {
            ...defaultConfig.enemies.types,
            basic: {
              ...defaultConfig.enemies.types.basic,
              health: 75,
              speed: 4
            }
          }
        }
      };

      enemyManager.updateConfig(newConfig);
      const enemy = enemyManager.createEnemy({ x: 0, y: 0 }, 'basic');
      
      expect(enemy.health).toBe(75);
      expect(enemy.speed).toBe(4);
    });
  });
}); 