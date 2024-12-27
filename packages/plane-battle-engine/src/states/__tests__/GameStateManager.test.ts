import { describe, test, expect, beforeEach } from 'vitest';
import { GameStateManager } from '../GameStateManager';
import { GameConfig } from '../../types/config';

describe('GameStateManager', () => {
  let gameStateManager: GameStateManager;
  let mockConfig: GameConfig;

  beforeEach(() => {
    mockConfig = {
      canvas: {
        width: 800,
        height: 600,
        backgroundColor: '#000000'
      },
      player: {
        size: { width: 32, height: 32 },
        hitboxSize: { width: 24, height: 24 },
        initialHealth: 100,
        lives: 3,
        speed: 5,
        fireRate: 2
      },
      weapons: {
        bulletSpeed: 10,
        bulletDamage: 10,
        bulletSize: { width: 8, height: 8 }
      }
    } as GameConfig;

    gameStateManager = new GameStateManager(mockConfig);
  });

  test('should create initial state correctly', () => {
    const state = gameStateManager.getState();
    expect(state.status).toBe('init');
    expect(state.score).toBe(0);
    expect(state.level).toBe(1);
    expect(state.isPaused).toBe(false);
    expect(state.isGameOver).toBe(false);
  });

  test('should start game correctly', () => {
    gameStateManager.startGame();
    const state = gameStateManager.getState();
    expect(state.status).toBe('playing');
    expect(state.isPaused).toBe(false);
    expect(state.isGameOver).toBe(false);
    expect(state.stats.sessionStats.gamesPlayed).toBe(1);
  });

  test('should pause and resume game correctly', () => {
    gameStateManager.startGame();
    gameStateManager.pauseGame();
    
    let state = gameStateManager.getState();
    expect(state.status).toBe('paused');
    expect(state.isPaused).toBe(true);

    gameStateManager.resumeGame();
    state = gameStateManager.getState();
    expect(state.status).toBe('playing');
    expect(state.isPaused).toBe(false);
  });

  test('should handle game over correctly', () => {
    gameStateManager.startGame();
    gameStateManager.updateScore(100);
    gameStateManager.gameOver();

    const state = gameStateManager.getState();
    expect(state.status).toBe('gameOver');
    expect(state.isGameOver).toBe(true);
    expect(state.stats.highScore).toBe(100);
  });

  test('should update score correctly', () => {
    gameStateManager.startGame();
    gameStateManager.updateScore(100);

    const state = gameStateManager.getState();
    expect(state.score).toBe(100);
    expect(state.stats.score).toBe(100);
  });

  test('should update performance correctly', () => {
    const performance = {
      fps: 60,
      frameTime: 16.67,
      lastUpdate: Date.now()
    };

    gameStateManager.updatePerformance(performance);
    const state = gameStateManager.getState();
    expect(state.performance).toEqual(performance);
  });

  test('should reset state correctly', () => {
    gameStateManager.startGame();
    gameStateManager.updateScore(100);
    gameStateManager.reset(mockConfig);

    const state = gameStateManager.getState();
    expect(state.status).toBe('init');
    expect(state.score).toBe(0);
    expect(state.isPaused).toBe(false);
    expect(state.isGameOver).toBe(false);
  });
}); 