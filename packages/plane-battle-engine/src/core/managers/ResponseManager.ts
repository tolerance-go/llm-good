/**
 * @class ResponseManager
 * @description 响应管理器 - 负责处理游戏中的各种事件响应
 * 
 * @responsibility
 * - 管理和维护游戏事件的响应处理器
 * - 处理游戏状态变更和事件响应
 * - 维护当前游戏状态的引用
 * 
 * @dependencies
 * - GameConfig: 游戏配置对象
 * - GameState: 游戏状态对象
 * - ResponseHandler: 响应处理器接口
 * - GameEventType: 游戏事件类型
 * 
 * @usedBy
 * - GameEngine: 游戏引擎使用响应管理器处理游戏事件
 * - InputService: 输入服务通过响应管理器处理输入事件
 * 
 * @singleton 使用单例模式，确保全局只有一个响应管理器实例
 */

import { ResponseHandler } from '../../types/response-types';
import { GameEventType, GameEventData } from '../../types/events';
import { GameConfig } from '../../types/config';
import { 
  KeyboardInputHandler, 
  CollisionHandler, 
  GameStateHandler,
  RunStateHandler
} from '../../responses';
import { StateManager } from './StateManager';
import { EventService } from '../services/EventService';
import { CommandManager } from './CommandManager';

export class ResponseManager {
  private handlers: Map<string, ResponseHandler> = new Map();
  private stateManager: StateManager;
  private config: GameConfig;
  private eventService: EventService;
  private commandManager: CommandManager;

  constructor(config: GameConfig, stateManager: StateManager, eventService: EventService, commandManager: CommandManager) {
    this.config = config;
    this.stateManager = stateManager;
    this.eventService = eventService;
    this.commandManager = commandManager;
    this.initializeHandlers();
    this.setupEventListeners();
  }

  private initializeHandlers(): void {
    // 使用 CommandManager 中的 CommandService
    const commandService = this.commandManager.getCommandService();
    const handlers = [
      new KeyboardInputHandler(commandService),
      new CollisionHandler(this.eventService),
      new GameStateHandler(this.eventService),
      new RunStateHandler(this.eventService)
    ];

    handlers.forEach(handler => {
      this.registerHandler(handler);
    });
  }

  private setupEventListeners(): void {
    Object.values(GameEventType).forEach(eventType => {
      this.eventService.on(eventType, (data: GameEventData[typeof eventType]) => {
        this.handleResponse(eventType, data);
      });
    });
  }

  public registerHandler(handler: ResponseHandler): void {
    this.handlers.set(handler.getName(), handler);
  }

  public removeHandler(handlerName: string): void {
    this.handlers.delete(handlerName);
  }

  public getHandler(handlerName: string): ResponseHandler | undefined {
    return this.handlers.get(handlerName);
  }

  public handleResponse<T extends GameEventType>(eventType: T, data: GameEventData[T]): void {
    const currentState = this.stateManager.getState();
    this.handlers.forEach(handler => {
      if (handler.canHandle(eventType)) {
        handler.handle(eventType, data, currentState, this.config);
      }
    });
  }
} 