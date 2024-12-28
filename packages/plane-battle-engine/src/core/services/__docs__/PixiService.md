# PixiService 服务类文档

## 简介

`PixiService` 是飞机大战游戏引擎中的核心渲染服务类，负责管理 PixiJS 应用实例和底层渲染功能。该服务类封装了 PixiJS 的基础功能，提供了一个统一的接口来处理游戏的渲染需求。

## 主要功能

### 1. 初始化与配置

- **构造函数**
  ```typescript
  constructor()
  ```
  初始化 PixiService 实例并创建日志收集器。

- **初始化应用**
  ```typescript
  async initialize(config: GameConfig, container: HTMLElement): Promise<PIXI.Application>
  ```
  - 创建并初始化 PixiJS 应用实例
  - 配置画布尺寸、背景色、抗锯齿等属性
  - 创建主容器并添加到舞台
  - 设置自适应缩放处理

### 2. 渲染管理

- **获取应用实例**
  ```typescript
  getApp(): PIXI.Application | null
  ```
  返回当前的 PixiJS 应用实例。

- **获取主容器**
  ```typescript
  getMainContainer(): PIXI.Container | null
  ```
  返回游戏主容器实例。

- **舞台操作**
  ```typescript
  addToStage(displayObject: PIXI.Container | PIXI.Sprite | PIXI.Graphics): void
  removeFromStage(displayObject: PIXI.Container | PIXI.Sprite | PIXI.Graphics): void
  ```
  提供添加和移除显示对象的方法。

### 3. 自适应处理

服务内置了自动缩放功能，可以根据父容器尺寸自动调整游戏视图，保持游戏画面的正确比例。主要特点：
- 监听窗口大小变化
- 自动计算最佳缩放比例
- 居中显示游戏内容
- 保持设计尺寸（800x600）的显示比例

### 4. 资源管理

- **销毁处理**
  ```typescript
  destroy(): void
  ```
  提供完整的资源清理机制，包括：
  - 移除事件监听
  - 销毁 PixiJS 应用实例
  - 清理所有子对象和纹理

## 使用示例

```typescript
// 创建服务实例
const pixiService = new PixiService();

// 初始化应用
const config = {
  canvas: {
    width: 800,
    height: 600
  }
};
const container = document.getElementById('game-container');
await pixiService.initialize(config, container);

// 添加游戏对象
const sprite = new PIXI.Sprite(texture);
pixiService.addToStage(sprite);

// 清理资源
pixiService.destroy();
```

## 注意事项

1. 初始化时需要提供有效的 DOM 容器元素
2. 使用前确保正确配置游戏配置对象（GameConfig）
3. 在组件卸载时调用 destroy 方法以防止内存泄漏
4. 所有显示对象的操作都应通��� PixiService 提供的方法进行

## 依赖关系

- PIXI.js：用于 2D 渲染
- LogCollector：用于日志收集和调试
- GameConfig：游戏配置类型定义 