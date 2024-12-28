import { GameCommand, CommandType, CommandTypeEnum, CommandReturnMap } from '../types/command-types';
import { GameConfig } from '../types/config';
import { StateManager } from '../core/managers/StateManager';
import { GameStateController } from '../states/GameStateController';
import { EventService } from '../core/services/EventService';

export class ResetCommand implements GameCommand {
  private config: GameConfig;
  private eventService: EventService;
  private stateManager: StateManager;

  constructor(config: GameConfig, eventService: EventService, stateManager: StateManager) {
    this.config = config;
    this.eventService = eventService;
    this.stateManager = stateManager;
  }

  getName(): CommandType {
    return CommandTypeEnum.RESET;
  }

  async execute(): Promise<CommandReturnMap[CommandTypeEnum.RESET]> {
    const state = this.stateManager.getState();
    const gameStateController = this.stateManager.getController<GameStateController>(GameStateController);

    if (gameStateController) {
      gameStateController.reset(state);
      return {
        success: true
      };
    }

    return {
      success: false
    };
  }
} 