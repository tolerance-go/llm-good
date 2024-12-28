import { GameCommand, CommandType, CommandTypeEnum } from '../types/command-types';
import { GameConfig } from '../types/config';
import { StateManager } from '../core/managers/StateManager';
import { LogCollector } from '../utils/LogCollector';
import { RunStateController } from '../states/RunStateController';

export class PauseCommand implements GameCommand {
  private config: GameConfig;
  private logger: LogCollector;

  constructor(config: GameConfig) {
    this.config = config;
    this.logger = LogCollector.getInstance();
  }

  getName(): CommandType {
    return CommandTypeEnum.PAUSE;
  }

  execute(stateManager: StateManager) {
    if (!stateManager) {
      throw new Error('StateManager not set');
    }

    const state = stateManager.getState();
    const previousStatus = state.status;
    
    // 记录暂停日志
    this.logger.addLog('PauseCommand', 'Game pause command executed');

    // 通过 StateManager 获取 RunStateController 来处理暂停
    const runStateController = stateManager.getController(RunStateController);
    if (runStateController) {
      runStateController.pause(state);
    }

    // 返回暂停结果
    return {
      success: true,
      previousStatus
    };
  }
} 