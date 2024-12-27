import { BaseResponseHandler } from '../abstract/BaseResponseHandler';
import { GameEventType, GameEventData } from '../types/events';
import { GameState } from '../types/state';
import { PlayerInput } from '../types/renderers';
import { LogCollector } from '../utils/LogCollector';
import { CommandService } from '../core/services/CommandService';

export class KeyboardInputHandler extends BaseResponseHandler {
  private logger: LogCollector;
  private commandCenter: CommandService;

  constructor() {
    super();
    this.logger = LogCollector.getInstance();
    this.commandCenter = CommandService.getInstance();
  }

  getName(): string {
    return 'KeyboardInputHandler';
  }

  canHandle(eventType: GameEventType): boolean {
    return eventType === GameEventType.INPUT_CHANGE;
  }

  getPriority(): number {
    return 1;
  }

  handle(eventType: GameEventType, data: GameEventData[GameEventType], state: GameState): void {
    if (!this.canHandle(eventType) || !this.isEnabled()) {
      return;
    }

    const inputData = data as PlayerInput;
    if (!inputData.keyboard) {
      return;
    }

    // 记录键盘输入状态变化
    this.logger.addLog('KeyboardInput', '键盘输入状态变化', {
      type: inputData.type,
      data: inputData.data,
      keyboard: inputData.keyboard,
      previousState: state.input.keyboard
    });

    // 更新游戏状态中的键盘输入
    state.input = {
      ...state.input,
      keyboard: inputData.keyboard
    };

    // 处理移动指令
    if (inputData.type === 'move' && inputData.data) {
      const direction = {
        x: inputData.data.x || 0,
        y: inputData.data.y || 0
      };

      if (direction.x !== 0 || direction.y !== 0) {
        this.logger.addLog('Movement', `执行移动指令 - 方向: (${direction.x}, ${direction.y})`, {
          direction,
          currentPosition: state.player.position,
          speed: state.player.speed
        });

        // 执行移动命令
        this.commandCenter.executeCommand('move', {
          direction,
          deltaTime: 1/60 // 假设 60fps
        });

        // 记录移动后的位置
        this.logger.addLog('Movement', `移动后位置: (${state.player.position.x}, ${state.player.position.y})`, {
          newPosition: state.player.position
        });
      }
    }
  }
} 