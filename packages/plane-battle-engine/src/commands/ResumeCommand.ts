import { GameCommand, CommandType, CommandTypeEnum } from '../types/command-types';
import { GameConfig } from '../types/config';
import { StateManager } from '../core/managers/StateManager';
import { LogCollector } from '../utils/LogCollector';
import { RunStateController } from '../states/RunStateController';

export class ResumeCommand implements GameCommand {
  private config: GameConfig;
  private logger: LogCollector;

  constructor(config: GameConfig) {
    this.config = config;
    this.logger = LogCollector.getInstance();
  }

  getName(): CommandType {
    return CommandTypeEnum.RESUME;
  }

  execute(stateManager: StateManager) {
    if (!stateManager) {
      throw new Error('StateManager not set');
    }

    const state = stateManager.getState();
    
    // 记录恢复日志
    this.logger.addLog('ResumeCommand', 'Game resume command executed');

    // 通过 StateManager 获取 RunStateController 来处理恢复
    const runStateController = stateManager.getController(RunStateController);
    if (runStateController) {
      runStateController.resume(state);
    }

    // 返回恢复结果
    return {
      success: true,
      newStatus: state.status
    };
  }
} 