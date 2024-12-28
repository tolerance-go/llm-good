import { GameCommand, CommandType, CommandTypeEnum, CommandReturnMap } from '../types/command-types';
import { GameConfig } from '../types/config';
import { StateManager } from '../core/managers/StateManager';
import { RunStateController } from '../states/RunStateController';
import { EventService } from '../core/services/EventService';

export class ResumeCommand implements GameCommand {
  private config: GameConfig;
  private eventService: EventService;

  constructor(config: GameConfig) {
    this.config = config;
    this.eventService = new EventService();
  }

  getName(): CommandType {
    return CommandTypeEnum.RESUME;
  }

  async execute(stateManager: StateManager): Promise<CommandReturnMap[CommandTypeEnum.RESUME]> {
    const state = stateManager.getState();
    const runStateController = stateManager.getController<RunStateController>(RunStateController);

    if (runStateController) {
      runStateController.resume(state);
      return {
        success: true,
        newStatus: state.status
      };
    }

    return {
      success: false,
      newStatus: state.status
    };
  }
} 