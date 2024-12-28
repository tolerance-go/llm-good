/**
 * @class EventCenter
 * @description 事件中心 - 游戏的事件总线，负责事件的发布和订阅
 * 
 * @responsibility
 * - 管理游戏中所有事件的发布和订阅
 * - 提供事件监听器的注册和移除
 * - 支持一次性事件监听
 * - 提供调试模式的事件日志
 * 
 * @dependencies
 * - GameEventHandler: 事件处理器类型
 * - GameEventType: 事件类型枚举
 * - GameEventData: 事件数据类型
 * 
 * @usedBy
 * - GameEngine: 游戏引擎使用事件中心进行系统间通信
 * - CommandCenter: 命令中心通过事件中心发布命令执行结果
 * - StateManager: 状态管理器通过事件中心通知状态变更
 * - InputService: 输入服务通过事件中心发布输入事件
 * 
 * @singleton 使用单例模式，确保全局只有一个事件中心实例
 */

import { GameEventHandler, GameEventType, GameEventData } from '../../types/events';

export class EventService {
  private listeners: Map<GameEventType, Set<GameEventHandler<GameEventData[GameEventType]>>>;
  private debugMode = false;

  constructor() {
    this.listeners = new Map();
  }

  public setDebug(enabled: boolean): void {
    this.debugMode = enabled;
  }

  public on<T extends GameEventType>(
    eventType: T,
    handler: GameEventHandler<GameEventData[T]>
  ): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(handler as GameEventHandler<GameEventData[GameEventType]>);
  }

  public off<T extends GameEventType>(
    eventType: T,
    handler: GameEventHandler<GameEventData[T]>
  ): void {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.delete(handler as GameEventHandler<GameEventData[GameEventType]>);
      if (handlers.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  public emit<T extends GameEventType>(eventType: T, data: GameEventData[T]): void {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          (handler as GameEventHandler<GameEventData[T]>)(data);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }

    if (this.debugMode) {
      console.log(`Event emitted: ${eventType}`, data);
    }
  }

  public once<T extends GameEventType>(
    eventType: T,
    handler: GameEventHandler<GameEventData[T]>
  ): void {
    const onceHandler: GameEventHandler<GameEventData[T]> = (data: GameEventData[T]) => {
      this.off(eventType, onceHandler);
      handler(data);
    };
    this.on(eventType, onceHandler);
  }

  public clear(): void {
    this.listeners.clear();
  }

  public hasListeners(eventType: GameEventType): boolean {
    return this.listeners.has(eventType) && (this.listeners.get(eventType)?.size ?? 0) > 0;
  }
} 