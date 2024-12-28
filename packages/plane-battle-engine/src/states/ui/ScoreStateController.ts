import { GameState } from '../../types/state';
import { GameConfig } from '../../types/config';
import { EventService } from '../../core/services/EventService';

export class ScoreStateController {
  private config: GameConfig;
  private eventService: EventService;

  constructor(config: GameConfig, eventService: EventService) {
    this.config = config;
    this.eventService = eventService;
  }

  update(state: GameState): void {
    // 在这里处理分数相关的状态更新逻辑
    // 例如：更新玩家的连击奖励
    if (state.player.combo.timer > 0) {
      const comboBonus = Math.floor(state.score * this.config.rules.scoring.combo.multiplier * state.player.combo.multiplier);
      if (comboBonus > 0) {
        state.score += comboBonus;
      }
    }
  }

  addScore(state: GameState, points: number): void {
    // 基础分数
    const basePoints = points * this.config.rules.scoring.multiplier;
    state.score += basePoints;
    
    // 更新玩家连击状态
    state.player.combo.count++;
    state.player.combo.timer = this.config.rules.scoring.combo.timeWindow;
    state.player.combo.multiplier = Math.min(
      state.player.combo.count * this.config.rules.scoring.combo.multiplier + 1,
      5 // 最大连击倍率限制为5倍
    );
  }

  resetScore(state: GameState): void {
    state.score = 0;
    state.player.combo.count = 0;
    state.player.combo.timer = 0;
    state.player.combo.multiplier = 1;
  }

  getCurrentScore(state: GameState): number {
    return state.score;
  }
} 