import { CommandMiddleware } from '../types/command-types';
import { StateManager } from '../core/managers/StateManager';
import { LogCollector } from '../utils/LogCollector';

export class StateLoggerMiddleware implements CommandMiddleware {
  private logger: LogCollector;

  constructor(private stateManager: StateManager) {
    this.logger = LogCollector.getInstance();
  }

  async before(commandType: string, params: unknown): Promise<void> {
    this.logger.addLog('CommandExecution', `[${commandType}] 执行前`, {
      params,
      state: this.stateManager.getState()
    });
  }

  async after(commandType: string, params: unknown, result: unknown): Promise<void> {
    this.logger.addLog('CommandExecution', `[${commandType}] 执行后`, {
      params,
      result,
      state: this.stateManager.getState()
    });
  }
} 