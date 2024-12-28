// 基础尺寸配置
export interface SizeConfig {
  width: number;
  height: number;
}

// 画布配置
export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor?: number;
}

// 玩家配置
export interface PlayerConfig {
  initialHealth: number;
  lives: number;
  speed: number;
  size: SizeConfig;
  fireRate: number;
  invincibleDuration: number;
  hitboxSize: SizeConfig;
  respawnDelay: number;
  respawnPosition: {
    x: number;
    y: number;
  };
}

// 武器系统配置
export interface WeaponConfig {
  fireRate: number;
  bulletSpeed: number;
  bulletDamage: number;
  bulletSize: SizeConfig;
  specialWeapons?: {
    spread?: {
      bulletCount: number;
      spreadAngle: number;
    };
    laser?: {
      duration: number;
      damage: number;
    };
    missile?: {
      damage: number;
      speed: number;
      tracking: boolean;
    };
  };
}

// 敌人配置
export interface EnemyConfig {
  types: {
    [key: string]: {
      health: number;
      speed: number;
      size: SizeConfig;
      score: number;
      damage: number;
      fireRate?: number;
      pattern?: 'straight' | 'zigzag' | 'circle' | 'follow';
    };
  };
  spawn: {
    rate: number;
    maxCount: number;
    patterns: {
      [key: string]: {
        enemyTypes: string[];
        frequency: number;
        count: number;
        formation?: 'line' | 'v' | 'circle';
      };
    };
  };
}

// 道具配置
export interface PowerUpConfig {
  types: {
    health: {
      value: number;
      duration?: number;
    };
    speed: {
      multiplier: number;
      duration: number;
    };
    fireRate: {
      multiplier: number;
      duration: number;
    };
    damage: {
      multiplier: number;
      duration: number;
    };
    shield: {
      duration: number;
    };
  };
  spawn: {
    frequency: number;
    maxCount: number;
    probability: {
      [key: string]: number;  // 每种道具的生成概率
    };
  };
}

// 游戏规则配置
export interface GameRulesConfig {
  difficultyLevel: 'easy' | 'normal' | 'hard' | 'nightmare';
  scoring: {
    baseScore: number;
    multiplier: number;
    combo: {
      timeWindow: number;
      multiplier: number;
    };
  };
  progression: {
    levelUpScore: number;
    wavesPerLevel: number;
    difficultyIncrease: {
      enemyHealth: number;
      enemySpeed: number;
      spawnRate: number;
    };
  };
  boundaryPadding: number;
  wrap: boolean;
  scoreMultiplier: number;
  enemySpawnRate: number;
  powerUpFrequency: number;
}

// 音效配置
export interface AudioConfig {
  enabled: boolean;
  volume: {
    master: number;
    sfx: number;
    music: number;
  };
  sounds: {
    [key: string]: {
      src: string;
      volume?: number;
      loop?: boolean;
    };
  };
}

// 调试配置
export interface DebugConfig {
  enabled: boolean;
  showHitboxes?: boolean;
  showFPS?: boolean;
}

// 完整游戏配置
export interface GameConfig {
  canvas: CanvasConfig;
  player: PlayerConfig;
  weapons: WeaponConfig;
  enemies: EnemyConfig;
  powerups: PowerUpConfig;
  rules: GameRulesConfig;
  audio: AudioConfig;
  debug: DebugConfig;
}

// 默认游戏配置
export const DEFAULT_CONFIG: GameConfig = {
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
      },
      medium: {
        health: 20,
        speed: 2,
        size: { width: 32, height: 32 },
        score: 200,
        damage: 20
      },
      boss: {
        health: 100,
        speed: 1,
        size: { width: 64, height: 64 },
        score: 1000,
        damage: 40
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
      health: {
        value: 20
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
        duration: 5000
      }
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
  },
  debug: {
    enabled: false,
    showHitboxes: false,
    showFPS: false
  }
}; 