import { GameCommand } from '../types/command-types';
import { GameConfig } from '../types/config';
import { StateManager } from '../core/managers/StateManager';
import { EventService } from '../core/services/EventService';
import { GameEventType } from '../types/events';
import { LogCollector } from '../utils/LogCollector';
import { PlayerStateController } from '../states/PlayerStateController';

export class MoveCommand implements GameCommand {
  private config: GameConfig;
  private logger: LogCollector;

  constructor(config: GameConfig) {
    this.config = config;
    this.logger = LogCollector.getInstance();
  }

  getName(): string {
    return 'move';
  }

  execute(stateManager: StateManager, eventCenter: EventService, params: { direction: { x: number; y: number }; deltaTime: number }): void {
    if (!stateManager || !params) {
      throw new Error('StateManager or params not set');
    }

    const { direction, deltaTime } = params;
    const state = stateManager.getState();
    
    // 记录移动日志
    this.logger.addLog('Movement', `Player moving command executed - Direction: (${direction.x}, ${direction.y})`, {
      direction,
      deltaTime
    });

    // 通过 StateManager 获取 PlayerStateController 来处理移动
    const playerController = stateManager.getController(PlayerStateController);
    if (playerController) {
      playerController.move(state, direction, deltaTime);
    }
    
    // 发送移动事件
    eventCenter.emit(GameEventType.PLAYER_MOVE, {
      type: 'move',
      data: {
        x: direction.x,
        y: direction.y
      }
    });
  }
} 