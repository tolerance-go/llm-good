import { GameCommand, CommandType, CommandTypeEnum, CommandReturnMap } from '../types/command-types';
import { GameConfig } from '../types/config';
import { StateManager } from '../core/managers/StateManager';
import { GameStateController } from '../states/GameStateController';
import { EventService } from '../core/services/EventService';

export class ResetCommand implements GameCommand {
  private config: GameConfig;
  private eventService: EventService;

  constructor(config: GameConfig) {
    this.config = config;
    this.eventService = new EventService();
  }

  getName(): CommandType {
    return CommandTypeEnum.RESET;
  }

  async execute(stateManager: StateManager): Promise<CommandReturnMap[CommandTypeEnum.RESET]> {
    const state = stateManager.getState();
    const gameStateController = stateManager.getController<GameStateController>(GameStateController);

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