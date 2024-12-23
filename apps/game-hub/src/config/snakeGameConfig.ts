export const SNAKE_GAME_CONFIG = {
  /** 游戏画布配置 */
  canvas: {
    /** 画布宽度（像素） */
    width: 800,
    /** 画布高度（像素） */
    height: 600,
    /** 游戏背景颜色 */
    backgroundColor: '#2d2d2d'
  },

  /** 网格系统配置 */
  grid: {
    /** 单个网格大小（像素） */
    size: 20,
    /** 蛇身方块大小（像素，略小于网格以产生间隔效果） */
    snakeSize: 18
  },

  /** 游戏机制配置 */
  gameplay: {
    /** 初始蛇的位置配置 */
    initialSnake: [
      { x: 200, y: 200 },
      { x: 180, y: 200 },
      { x: 160, y: 200 }
    ],

    /** 移动速度相关配置 */
    speed: {
      /** 基础移动间隔（毫秒） */
      baseInterval: 100,
      /** 最快移动间隔（毫秒） */
      minInterval: 40,
      /** 最慢移动间隔（毫秒） */
      maxInterval: 150,
      /** 每得100分减少的基础间隔（毫秒） */
      scoreSpeedupInterval: 5
    },

    /** 计分系统配置 */
    scoring: {
      /** 基础得分 */
      baseScore: 10,
      /** 连击时间窗口（毫秒） */
      comboTimeWindow: 1000
    },

    /** 能力系统配置 */
    abilities: {
      /** 无敌模式配置 */
      invincible: {
        /** 激活所需分数 */
        requiredScore: 100,
        /** 持续时间（毫秒） */
        duration: 5000
      }
    }
  },

  /** 视觉效果配置 */
  visuals: {
    /** 蛇的颜色配置 */
    colors: {
      /** 普通状态下蛇的颜色 */
      snake: 0x00ff00,
      /** 食物颜色 */
      food: 0xff0000,
      /** 穿墙特效颜色 */
      teleport: 0x00ffff,
      /** 自动调整特效颜色 */
      autoAdjust: 0xffff00
    },

    /** 特效配置 */
    effects: {
      /** 移动特效配置 */
      movement: {
        /** 特效持续时间（毫秒） */
        duration: 200,
        /** 特效初始透明度 */
        initialAlpha: 0.5,
        /** 特效缩放倍数 */
        scale: 1.5
      },
      /** 穿墙特效配置 */
      teleport: {
        /** 特效大小（像素） */
        size: 15,
        /** 特效持续时间（毫秒） */
        duration: 200,
        /** 特效初始透明度 */
        alpha: 0.8
      },
      /** 自动调整特效配置 */
      autoAdjust: {
        /** 特效大小（像素） */
        size: 12,
        /** 特效持续时间（毫秒） */
        duration: 300,
        /** 特效��始透明度 */
        alpha: 0.6,
        /** 特效缩放倍数 */
        scale: 1.5
      }
    },

    /** 文本样式配置 */
    text: {
      /** 分数显示样式 */
      score: {
        /** 字体大小 */
        fontSize: '32px',
        /** 文字颜色 */
        color: '#fff',
        /** 位置X */
        x: 16,
        /** 位置Y */
        y: 16
      },
      /** 连击显示样式 */
      combo: {
        /** 字体大小 */
        fontSize: '24px',
        /** 文字颜色 */
        color: '#ffff00',
        /** 位置X */
        x: 16,
        /** 位置Y */
        y: 56
      },
      /** 加速提示样式 */
      speedUp: {
        /** 字体大小 */
        fontSize: '48px',
        /** 文字颜色 */
        color: '#ff0000',
        /** 位置X */
        x: 400,
        /** 位置Y */
        y: 300
      }
    }
  }
} as const

/** 游戏配置类型定义 */
export type SnakeGameConfig = typeof SNAKE_GAME_CONFIG 