import { GameCommand, CommandType, CommandTypeEnum } from '../types/command-types';
import { GameConfig } from '../types/config';
import { StateManager } from '../core/managers/StateManager';
import { LogCollector } from '../utils/LogCollector';
import { PlayerStateController } from '../states/PlayerStateController';

export class MoveCommand implements GameCommand {
  private config: GameConfig;
  private logger: LogCollector;

  constructor(config: GameConfig) {
    this.config = config;
    this.logger = LogCollector.getInstance();
  }

  getName(): CommandType {
    return CommandTypeEnum.MOVE;
  }

  execute(stateManager: StateManager, params: { direction: { x: number; y: number }; deltaTime: number }) {
    if (!stateManager || !params) {
      throw new Error('StateManager or params not set');
    }

    const { direction, deltaTime } = params;
    const state = stateManager.getState();
    
    // 记录移动日志
    this.logger.addLog('MoveCommand', `Player moving command executed - Direction: (${direction.x}, ${direction.y})`, {
      direction,
      deltaTime
    });

    // 通过 StateManager 获取 PlayerStateController 来处理移动
    const playerController = stateManager.getController(PlayerStateController);
    if (playerController) {
      playerController.move(state, direction, deltaTime);
    }

    // 返回移动结果
    return {
      newPosition: { ...state.player.position },
      success: true
    };
  }
} 