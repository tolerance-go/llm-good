import { GameCommand } from '../types/command-types';
import { GameConfig } from '../types/config';
import { StateManager } from '../core/managers/StateManager';
import { EventService } from '../core/services/EventService';
import { GameEventType } from '../types/events';
import { LogCollector } from '../utils/LogCollector';

export class MoveCommand implements GameCommand {
  private config: GameConfig;
  private logger: LogCollector;

  constructor(config: GameConfig) {
    this.config = config;
    this.logger = LogCollector.getInstance();
  }

  getName(): string {
    return 'move';
  }

  execute(stateManager: StateManager, eventCenter: EventService, params: { direction: { x: number; y: number }; deltaTime: number }): void {
    if (!stateManager || !params) {
      throw new Error('StateManager or params not set');
    }

    const state = stateManager.getState();
    const { direction, deltaTime } = params;
    
    // 记录移动开始日志
    this.logger.addLog('Movement', `Player moving - Direction: (${direction.x}, ${direction.y}), Speed: ${state.player.speed}, DeltaTime: ${deltaTime}`, {
      direction,
      speed: state.player.speed,
      deltaTime,
      currentPosition: state.player.position
    });
    
    // 更新玩家位置
    const speed = state.player.speed * deltaTime;
    const newX = state.player.position.x + direction.x * speed;
    const newY = state.player.position.y + direction.y * speed;

    // 确保玩家不会移出画布
    const minX = state.player.size.width / 2;
    const maxX = this.config.canvas.width - state.player.size.width / 2;
    const minY = state.player.size.height / 2;
    const maxY = this.config.canvas.height - state.player.size.height / 2;

    state.player.position.x = Math.max(minX, Math.min(maxX, newX));
    state.player.position.y = Math.max(minY, Math.min(maxY, newY));

    // 记录最终位置日志
    this.logger.addLog('Movement', `Player moved to position: (${state.player.position.x}, ${state.player.position.y})`, {
      newPosition: state.player.position,
      wasConstrained: newX !== state.player.position.x || newY !== state.player.position.y
    });

    // 更新状态
    stateManager.setState(state);
    
    // 发送移动事件
    eventCenter.emit(GameEventType.PLAYER_MOVE, {
      type: 'move',
      data: {
        x: direction.x,
        y: direction.y
      }
    });
  }
} 