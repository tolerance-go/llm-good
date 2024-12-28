/**
 * @class ConfigManager
 * @description 配置管理器 - 负责管理游戏的所有配置项
 * 
 * @responsibility
 * - 管理游戏配置
 * - 提供配置的读取和更新接口
 * - 验证配置的有效性
 * - 处理配置的持久化
 * 
 * @dependencies
 * - GameConfig: 游戏配置类型
 * - StateManager: 状态管理器使用配置初始化游戏状态
 * - RenderService: 渲染服务使用配置初始化渲染参数
 */

import { GameConfig, DEFAULT_CONFIG } from '../../types';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export class ConfigManager {
  private config: GameConfig;
  private readonly listeners: Array<(config: GameConfig) => void> = [];

  constructor(initialConfig: DeepPartial<GameConfig> = {}) {
    this.config = this.mergeConfig(initialConfig);
  }

  private mergeConfig(userConfig: DeepPartial<GameConfig>): GameConfig {
    const baseConfig: GameConfig = {
      canvas: {
        width: 800,
        height: 600,
        backgroundColor: 0x000000
      },
      player: {
        initialHealth: 100,
        lives: 3,
        speed: 8,
        size: { width: 40, height: 40 },
        fireRate: 5,
        invincibleDuration: 3000,
        hitboxSize: { width: 30, height: 30 },
        respawnDelay: 1000,
        respawnPosition: { x: 400, y: 550 }
      },
      weapons: {
        fireRate: 5,
        bulletSpeed: 15,
        bulletDamage: 1,
        bulletSize: { width: 4, height: 10 },
        specialWeapons: {
          spread: {
            bulletCount: 3,
            spreadAngle: 15
          },
          laser: {
            duration: 2000,
            damage: 2
          },
          missile: {
            damage: 3,
            speed: 12,
            tracking: true
          }
        }
      },
      enemies: {
        types: {
          basic: {
            health: 1,
            speed: 2,
            size: { width: 30, height: 30 },
            score: 100,
            damage: 1,
            fireRate: 1
          },
          fast: {
            health: 1,
            speed: 4,
            size: { width: 20, height: 20 },
            score: 150,
            damage: 1,
            fireRate: 0.5
          },
          tank: {
            health: 3,
            speed: 1,
            size: { width: 40, height: 40 },
            score: 200,
            damage: 2,
            fireRate: 2
          }
        },
        spawn: {
          rate: 1000,
          maxCount: 10,
          patterns: {
            single: {
              enemyTypes: ['basic'],
              frequency: 1,
              count: 1
            },
            wave: {
              enemyTypes: ['basic', 'fast'],
              frequency: 0.5,
              count: 5,
              formation: 'line' as const
            },
            boss: {
              enemyTypes: ['tank'],
              frequency: 0.1,
              count: 1
            }
          }
        }
      },
      powerups: {
        types: {
          health: {
            value: 50,
            duration: 0
          },
          speed: {
            multiplier: 1.5,
            duration: 5000
          },
          fireRate: {
            multiplier: 2,
            duration: 5000
          },
          damage: {
            multiplier: 2,
            duration: 5000
          },
          shield: {
            duration: 10000
          }
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
          },
          powerup: {
            src: '/sounds/powerup.mp3',
            volume: 0.7
          },
          gameOver: {
            src: '/sounds/game-over.mp3',
            volume: 0.8
          }
        }
      },
      debug: {
        enabled: false,
        showHitboxes: false,
        showFPS: false
      }
    };

    // 深度合并配置
    return this.deepMerge(baseConfig, DEFAULT_CONFIG, userConfig);
  }

  private deepMerge<T>(target: T, ...sources: Array<DeepPartial<T>>): T {
    if (!sources.length) return target;
    const source = sources.shift();
    if (!source) return target;

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          const sourceValue = source[key];
          if (this.isObject(sourceValue)) {
            if (!target[key]) {
              (target as Record<string, unknown>)[key] = {};
            }
            this.deepMerge(
              (target as Record<string, unknown>)[key] as object,
              sourceValue as object
            );
          } else {
            (target as Record<string, unknown>)[key] = sourceValue;
          }
        }
      }
    }

    return this.deepMerge(target, ...sources);
  }

  private isObject(item: unknown): item is object {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
  }

  public getConfig(): GameConfig {
    return { ...this.config };
  }

  public updateConfig(partialConfig: Partial<GameConfig>): void {
    this.config = this.mergeConfig(partialConfig);
    this.notifyListeners();
  }

  public setDebugMode(enabled: boolean): void {
    this.config.debug = {
      ...this.config.debug,
      enabled,
      showHitboxes: enabled,
      showFPS: enabled
    };
    this.notifyListeners();
  }

  public setDifficulty(level: 'easy' | 'normal' | 'hard' | 'nightmare'): void {
    const difficultySettings = {
      easy: {
        enemyHealth: 0.8,
        enemySpeed: 0.8,
        enemySpawnRate: 0.8,
        playerHealth: 1.2,
        scoreMultiplier: 0.8
      },
      normal: {
        enemyHealth: 1,
        enemySpeed: 1,
        enemySpawnRate: 1,
        playerHealth: 1,
        scoreMultiplier: 1
      },
      hard: {
        enemyHealth: 1.2,
        enemySpeed: 1.2,
        enemySpawnRate: 1.2,
        playerHealth: 0.8,
        scoreMultiplier: 1.2
      },
      nightmare: {
        enemyHealth: 1.5,
        enemySpeed: 1.5,
        enemySpawnRate: 1.5,
        playerHealth: 0.6,
        scoreMultiplier: 1.5
      }
    };

    const settings = difficultySettings[level];
    this.config.rules.difficultyLevel = level;
    this.config.enemies.types = Object.entries(this.config.enemies.types).reduce((acc, [key, enemy]) => ({
      ...acc,
      [key]: {
        ...enemy,
        health: Math.ceil(enemy.health * settings.enemyHealth),
        speed: enemy.speed * settings.enemySpeed
      }
    }), {});
    this.config.rules.enemySpawnRate *= settings.enemySpawnRate;
    this.config.player.initialHealth = Math.ceil(this.config.player.initialHealth * settings.playerHealth);
    this.config.rules.scoreMultiplier = settings.scoreMultiplier;

    this.notifyListeners();
  }

  public subscribe(listener: (config: GameConfig) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getConfig()));
  }

  public validate(): boolean {
    const config = this.config;
    
    // 验证画布配置
    if (!config.canvas.width || !config.canvas.height) {
      console.error('Invalid canvas dimensions');
      return false;
    }

    // 验证玩家配置
    if (!config.player.size || !config.player.hitboxSize) {
      console.error('Invalid player size configuration');
      return false;
    }

    // 验证武器配置
    if (!config.weapons.bulletSize || config.weapons.fireRate <= 0) {
      console.error('Invalid weapons configuration');
      return false;
    }

    // 验证敌人配置
    if (!config.enemies.types || Object.keys(config.enemies.types).length === 0) {
      console.error('No enemy types defined');
      return false;
    }

    // 验证规则配置
    if (!config.rules.scoring || !config.rules.progression) {
      console.error('Invalid game rules configuration');
      return false;
    }

    return true;
  }
} 