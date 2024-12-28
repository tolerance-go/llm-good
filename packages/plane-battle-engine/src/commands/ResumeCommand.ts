import { GameCommand, CommandType, CommandTypeEnum, CommandReturnMap } from '../types/command-types';
import { GameConfig } from '../types/config';
import { StateManager } from '../core/managers/StateManager';
import { RunStateController } from '../states/RunStateController';
import { EventService } from '../core/services/EventService';

export class ResumeCommand implements GameCommand {
  private config: GameConfig;
  private eventService: EventService;
  private stateManager: StateManager;

  constructor(config: GameConfig, eventService: EventService, stateManager: StateManager) {
    this.config = config;
    this.eventService = eventService;
    this.stateManager = stateManager;
  }

  getName(): CommandType {
    return CommandTypeEnum.RESUME;
  }

  async execute(): Promise<CommandReturnMap[CommandTypeEnum.RESUME]> {
    const state = this.stateManager.getState();
    const runStateController = this.stateManager.getController<RunStateController>(RunStateController);

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