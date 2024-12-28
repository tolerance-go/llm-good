import { StateManager } from '../core/managers/StateManager';
import { GameConfig } from '../types/config';

export class ScoreStateManager extends StateManager {
  constructor(config: GameConfig) {
    super(config);
  }

  public addScore(points: number): void {
    const currentState = this.getState();
    this.setState({
      score: currentState.score + points
    });
  }

  public resetScore(): void {
    this.setState({
      score: 0
    });
  }

  public getCurrentScore(): number {
    return this.getState().score;
  }
} 