import { GameCommand, CommandType, CommandTypeEnum } from '../types/command-types';
import { GameConfig } from '../types/config';
import { StateManager } from '../core/managers/StateManager';
import { LogCollector } from '../utils/LogCollector';
import { GameStateController } from '../states/GameStateController';

export class ResetCommand implements GameCommand {
  private config: GameConfig;
  private logger: LogCollector;

  constructor(config: GameConfig) {
    this.config = config;
    this.logger = LogCollector.getInstance();
  }

  getName(): CommandType {
    return CommandTypeEnum.RESET;
  }

  execute(stateManager: StateManager) {
    if (!stateManager) {
      throw new Error('StateManager not set');
    }

    const state = stateManager.getState();
    
    // 记录重置日志
    this.logger.addLog('ResetCommand', 'Game reset command executed');

    // 通过 StateManager 获取 GameStateController 来处理重置
    const gameStateController = stateManager.getController(GameStateController);
    if (gameStateController) {
      gameStateController.reset(state);
    }

    // 返回重置结果
    return {
      success: true
    };
  }
} 