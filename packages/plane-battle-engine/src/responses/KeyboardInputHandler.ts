import { BaseResponseHandler } from '../abstract/BaseResponseHandler';
import { GameEventType, GameEventData } from '../types/events';
import { GameState } from '../types/state';
import { PlayerInput } from '../types/renderers';
import { LogCollector } from '../utils/LogCollector';
import { CommandService } from '../core/services/CommandService';
import { CommandTypeEnum } from '../types/command-types';

export class KeyboardInputHandler extends BaseResponseHandler {
  private logger: LogCollector;
  private commandService: CommandService;

  constructor(commandService: CommandService) {
    super();
    this.logger = LogCollector.getInstance();
    this.commandService = commandService;
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

  handle(eventType: GameEventType, data: GameEventData[GameEventType], currentState: Readonly<GameState>): void {
    if (!this.canHandle(eventType) || !this.isEnabled()) {
      return;
    }

    const inputData = data as PlayerInput;
    if (!inputData.keyboard) {
      return;
    }

    // 记录键盘输入状态变化
    this.logger.addLog('KeyboardInputHandler', '键盘输入状态变化', {
      type: inputData.type,
      data: inputData.data,
      keyboard: inputData.keyboard,
      previousState: currentState.input.keyboard
    });

    // 根据键盘状态计算移动方向
    const direction = {
      x: (inputData.keyboard.right ? 1 : 0) - (inputData.keyboard.left ? 1 : 0),
      y: (inputData.keyboard.down ? 1 : 0) - (inputData.keyboard.up ? 1 : 0)
    };

    if (direction.x !== 0 || direction.y !== 0) {
      this.logger.addLog('KeyboardInputHandler', `执行移动指令 - 方向: (${direction.x}, ${direction.y})`, {
        direction,
        currentPosition: currentState.player.position,
        speed: currentState.player.speed
      });

      // 执行移动命令
      this.commandService.executeCommand(CommandTypeEnum.MOVE, {
        direction,
        deltaTime: 1/60 // 假设 60fps
      });

      // 记录移动后的位置
      this.logger.addLog('KeyboardInputHandler', `移动后位置: (${currentState.player.position.x}, ${currentState.player.position.y})`, {
        newPosition: currentState.player.position
      });
    }
  }
} 