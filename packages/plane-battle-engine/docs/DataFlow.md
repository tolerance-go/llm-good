# 数据流

## 组件交互图

```mermaid
sequenceDiagram
    participant Game as GameEngine
    participant State as StateManager
    participant Config as ConfigManager
    participant Input as InputService
    participant Command as CommandCenter
    participant RenderCore as RenderService
    participant Response as ResponseManager

    Game->>Config: 1. 初始化配置
    Config-->>Game: 返回游戏配置

    Game->>State: 2. 初始化状态
    State-->>Game: 返回初始状态

    loop 游戏循环
        Input->>Command: 3. 发送输入命令
        Command->>State: 4. 更新状态
        State-->>Game: 返回新状态
        Game->>RenderCore: 5. 渲染状态
        Game->>Response: 6. 处理响应
    end
```

## 核心组件

1. **游戏引擎 (GameEngine)**
   - 游戏的核心控制器
   - 负责协调各个组件的工作
   - 管理游戏生命周期

2. **状态管理器 (StateManager)**
   - 维护游戏状态
   - 处理状态更新
   - 提供状态查询接口

3. **配置管理器 (ConfigManager)**
   - 管理游戏配置
   - 提供配置更新接口
   - 处理配置持久化

4. **命令中心 (CommandCenter)**
   - 处理游戏命令
   - 转换输入为状态更新
   - 管理命令队列

5. **渲染服务 (RenderService)**
   - 管理画布上下文
   - 协调渲染器工作
   - 处理渲染性能

6. **响应管理器 (ResponseManager)**
   - 处理游戏响应
   - 管理事件监听
   - 触发游戏效果 