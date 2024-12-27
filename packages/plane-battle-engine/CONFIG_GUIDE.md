# 游戏配置指南

本文档详细介绍了游戏引擎的配置系统，帮助你理解和使用各项配置选项。

## 配置体系

游戏配置采用模块化设计，分为以下几个主要部分：

### 1. 基础配置

```typescript
interface BasicConfig {
  canvas: {
    width: number;      // 画布宽度
    height: number;     // 画布高度
    backgroundColor: string; // 背景色
  };
  debug?: {
    enabled: boolean;   // 是否启用调试
    showHitboxes?: boolean; // 显示碰撞箱
    showFPS?: boolean;  // 显示帧率
  };
}
```

### 2. 场景系统

```typescript
interface SceneConfig {
  initialScene: 'menu' | 'game' | 'pause' | 'gameOver';
  menuOptions?: string[];  // 菜单选项
  score?: number;         // 当前分数
  lives?: number;         // 生命数
  shield?: number;        // 护盾数
  stats?: {              // 游戏统计
    smallEnemiesDestroyed: number;
    mediumEnemiesDestroyed: number;
    bossesDestroyed: number;
    timeAlive: string;
    maxCombo: number;
  };
}
```

### 3. 游戏元素

#### 玩家配置
```typescript
interface PlayerConfig {
  initialHealth: number;  // 初始生命值
  lives: number;         // 生命数量
  speed: number;         // 移动速度
  size: {               // 玩家大小
    width: number;
    height: number;
  };
  fireRate: number;      // 射击频率
  invincibleDuration: number; // 无敌时间
}
```

#### 敌人系统
```typescript
interface EnemyConfig {
  types: {              // 敌人类型
    basic: {
      health: number;   // 生命值
      speed: number;    // 速度
      size: {width: number; height: number};
      score: number;    // 得分
      damage: number;   // 伤害
    };
    // 其他敌人类型...
  };
  spawn: {
    rate: number;      // 生成频率
    maxCount: number;  // 最大数量
    patterns: {        // 生成模式
      [key: string]: {
        enemyTypes: string[];
        frequency: number;
        count: number;
      };
    };
  };
}
```

#### 道具系统
```typescript
interface PowerUpConfig {
  types: {
    health: {value: number};
    speed: {multiplier: number; duration: number};
    fireRate: {multiplier: number; duration: number};
    shield: {duration: number};
  };
  spawn: {
    frequency: number;
    maxCount: number;
    probability: {[key: string]: number};
  };
}
```

## 使用示例

### 1. 基础游戏配置

```typescript
const config = {
  canvas: {
    width: 800,
    height: 600,
    backgroundColor: '#000033'
  },
  debug: {
    enabled: true,
    showHitboxes: true
  },
  lives: 3,
  shield: 1
};
```

### 2. 配置游戏场景

```typescript
const menuConfig = {
  initialScene: 'menu',
  menuOptions: [
    '开始游戏',
    '选择难度',
    '排行榜',
    '设置选项'
  ]
};
```

### 3. 配置敌人系统

```typescript
const enemyConfig = {
  types: {
    basic: {
      health: 20,
      speed: 3,
      size: { width: 32, height: 32 },
      score: 100,
      damage: 10
    }
  },
  spawn: {
    rate: 1000,
    maxCount: 10,
    patterns: {
      wave: {
        enemyTypes: ['basic'],
        frequency: 1,
        count: 5
      }
    }
  }
};
```

## 配置最佳实践

1. **渐进式配置**
   - 从基础配置开始
   - 逐步添加高级特性
   - 及时测试每个配置项

2. **性能优化**
   - 合理设置敌人生成频率
   - 控制同屏元素数量
   - 适当使用调试模式

3. **游戏平衡**
   - 平衡敌人难度
   - 合理设置道具效果
   - 调整计分规则

4. **配置复用**
   - 提取通用配置
   - 创建配置预设
   - 使用配置继承

## 调试技巧

1. **使用调试模式**
   ```typescript
   const debugConfig = {
     debug: {
       enabled: true,
       showHitboxes: true,
       showFPS: true
     }
   };
   ```

2. **场景测试**
   - 使用不同场景配置
   - 测试场景切换
   - 验证状态保持

3. **元素调试**
   - 检查碰撞箱
   - 监控性能指标
   - 测试边界情况

## 常见问题

1. **性能问题**
   - 检查敌人生成频率
   - 优化碰撞检测
   - 减少同屏元素

2. **游戏平衡**
   - 调整敌人属性
   - 平衡道具效果
   - 优化难度曲线

3. **配置冲突**
   - 检查配置优先级
   - 验证配置组合
   - 处理边界情况 