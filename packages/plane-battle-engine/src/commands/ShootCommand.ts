import { GameCommand, CommandType, CommandTypeEnum } from '../types/command-types';
import { GameConfig } from '../types/config';
import { StateManager } from '../core/managers/StateManager';
import { LogCollector } from '../utils/LogCollector';
import { PlayerStateController } from '../states/PlayerStateController';

export class ShootCommand implements GameCommand {
  private config: GameConfig;
  private logger: LogCollector;
  private stateManager: StateManager;

  constructor(config: GameConfig, stateManager: StateManager) {
    this.config = config;
    this.logger = LogCollector.getInstance();
    this.stateManager = stateManager;
  }

  getName(): CommandType {
    return CommandTypeEnum.SHOOT;
  }

  execute(params: { position: { x: number; y: number } }) {
    if (!params) {
      throw new Error('Params not set');
    }

    const { position } = params;
    const state = this.stateManager.getState();
    
    // 记录射击日志
    this.logger.addLog('ShootCommand', `Player shooting command executed - Position: (${position.x}, ${position.y})`, {
      position
    });

    // 通过 StateManager 获取 PlayerStateController 来处理射击
    const playerController = this.stateManager.getController(PlayerStateController);
    if (playerController) {
      playerController.shoot(state, position);
    }

    // 返回射击结果
    const bulletId = `bullet_${Date.now()}`;
    return {
      bulletId,
      success: true
    };
  }
} 