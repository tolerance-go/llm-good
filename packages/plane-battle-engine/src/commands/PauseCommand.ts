import { GameCommand, CommandType, CommandTypeEnum, CommandReturnMap } from '../types/command-types';
import { GameConfig } from '../types/config';
import { StateManager } from '../core/managers/StateManager';
import { RunStateController } from '../states/RunStateController';
import { EventService } from '../core/services/EventService';

export class PauseCommand implements GameCommand {
  private config: GameConfig;
  private eventService: EventService;

  constructor(config: GameConfig) {
    this.config = config;
    this.eventService = new EventService();
  }

  getName(): CommandType {
    return CommandTypeEnum.PAUSE;
  }

  async execute(stateManager: StateManager): Promise<CommandReturnMap[CommandTypeEnum.PAUSE]> {
    const state = stateManager.getState();
    const runStateController = stateManager.getController<RunStateController>(RunStateController);

    if (runStateController) {
      const previousStatus = state.status;
      runStateController.pause(state);
      return {
        success: true,
        previousStatus
      };
    }

    return {
      success: false,
      previousStatus: state.status
    };
  }
} 