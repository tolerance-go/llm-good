import { GameState } from '../types/state';
import { GameConfig } from '../types/config';

export class GameStateManager {
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
  }

  update(state: GameState): void {
    // 更新游戏状态
    if (state.status === 'playing') {
      // 检查游戏是否结束
      if (state.player.lives <= 0) {
        state.status = 'gameOver';
        state.isGameOver = true;
      }

      // 检查关卡进度
      if (state.enemies.length === 0) {
        state.currentWave++;
        if (state.currentWave > this.config.rules.progression.wavesPerLevel) {
          state.currentLevel++;
          state.currentWave = 1;
        }
      }
    }
  }
} 