/**
 * @class InputService
 * @description 输入服务 - 负责处理所有用户输入事件
 * 
 * @responsibility
 * - 监听和处理键盘输入事件
 * - 将原始输入转换为游戏命令
 * - 管理输入状态
 * - 提供输入事件的启用/禁用控制
 * 
 * @dependencies
 * - EventCenter: 事件中心，用于发布输入事件
 * - LogCollector: 日志收集器，用于记录输入事件
 * - PlayerInput: 输入类型定义
 * 
 * @usedBy
 * - GameEngine: 游戏引擎使用输入服务处理用户输入
 * - CommandCenter: 命令中心根据输入生成相应的命令
 * 
 * @singleton 使用单例模式，确保全局只有一个输入服务实例
 */

import { LogCollector } from '../../utils/LogCollector';
import { PlayerInput } from '../../types/renderers';
import { EventService } from './EventService';
import { GameEventType } from '../../types/events';

export class InputService {
  private logger: LogCollector;
  private eventCenter: EventService;
  private enabled: boolean = true;
  private keyboardState: {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    space: boolean;
  } = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false
  };

  constructor(eventService: EventService) {
    this.logger = LogCollector.getInstance();
    this.eventCenter = eventService;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) return;

    this.logger.addLog('InputService', `键盘按下: ${event.code}`, { code: event.code });

    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.keyboardState.left = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keyboardState.right = true;
        break;
      case 'ArrowUp':
      case 'KeyW':
        this.keyboardState.up = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.keyboardState.down = true;
        break;
      case 'Space':
        this.keyboardState.space = true;
        break;
    }

    // 发送键盘状态变更事件
    const input: PlayerInput = {
      type: 'keyboard',
      data: { pressed: true, key: event.code },
      keyboard: { ...this.keyboardState }
    };
    this.eventCenter.emit(GameEventType.INPUT_CHANGE, input);
  }

  private handleKeyUp(event: KeyboardEvent): void {
    if (!this.enabled) return;

    this.logger.addLog('InputService', `键盘释放: ${event.code}`, { code: event.code });

    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.keyboardState.left = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keyboardState.right = false;
        break;
      case 'ArrowUp':
      case 'KeyW':
        this.keyboardState.up = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.keyboardState.down = false;
        break;
      case 'Space':
        this.keyboardState.space = false;
        break;
    }

    // 发送键盘状态变更事件
    const input: PlayerInput = {
      type: 'keyboard',
      data: { pressed: false, key: event.code },
      keyboard: { ...this.keyboardState }
    };
    this.eventCenter.emit(GameEventType.INPUT_CHANGE, input);
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
} 