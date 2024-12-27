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
  private static instance: InputService;
  private logger: LogCollector;
  private eventCenter: EventService;
  private enabled: boolean = true;

  private constructor() {
    this.logger = LogCollector.getInstance();
    this.eventCenter = EventService.getInstance();
    this.setupEventListeners();
  }

  public static getInstance(): InputService {
    if (!InputService.instance) {
      InputService.instance = new InputService();
    }
    return InputService.instance;
  }

  private setupEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) return;

    this.logger.addLog('Input', `键盘按下: ${event.code}`, { code: event.code });

    let moveDirection = { x: 0, y: 0 };
    let shouldEmitMove = true;

    switch (event.code) {
      case 'Space':
        shouldEmitMove = false;
        this.eventCenter.emit(GameEventType.INPUT_CHANGE, {
          type: 'fire',
          data: { pressed: true }
        });
        break;
      case 'Escape':
        shouldEmitMove = false;
        this.eventCenter.emit(GameEventType.INPUT_CHANGE, {
          type: 'pause',
          data: { pressed: true }
        });
        break;
      case 'ArrowLeft':
      case 'KeyA':
        moveDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'KeyD':
        moveDirection = { x: 1, y: 0 };
        break;
      case 'ArrowUp':
      case 'KeyW':
        moveDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 'KeyS':
        moveDirection = { x: 0, y: 1 };
        break;
      default:
        shouldEmitMove = false;
    }

    if (shouldEmitMove) {
      this.logger.addLog('Input', `发送移动指令`, { direction: moveDirection });
      const input: PlayerInput = {
        type: 'move',
        data: moveDirection,
        keyboard: {
          left: moveDirection.x < 0,
          right: moveDirection.x > 0,
          up: moveDirection.y < 0,
          down: moveDirection.y > 0,
          space: false
        }
      };
      this.eventCenter.emit(GameEventType.INPUT_CHANGE, input);
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    if (!this.enabled) return;

    this.logger.addLog('Input', `键盘释放: ${event.code}`, { code: event.code });

    let input: PlayerInput | null = null;

    switch (event.code) {
      case 'Space':
        input = {
          type: 'fire',
          data: { pressed: false }
        };
        break;
      case 'ArrowLeft':
      case 'KeyA':
      case 'ArrowRight':
      case 'KeyD':
      case 'ArrowUp':
      case 'KeyW':
      case 'ArrowDown':
      case 'KeyS':
        this.logger.addLog('Input', `停止移动`, { code: event.code });
        input = {
          type: 'move',
          data: { x: 0, y: 0 },
          keyboard: {
            left: false,
            right: false,
            up: false,
            down: false,
            space: false
          }
        };
        break;
    }

    if (input) {
      this.eventCenter.emit(GameEventType.INPUT_CHANGE, input);
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
} 