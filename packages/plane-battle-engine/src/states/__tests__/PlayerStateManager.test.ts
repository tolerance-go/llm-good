import { describe, test, expect, beforeEach } from 'vitest';
import { PlayerStateManager } from '../PlayerStateManager';
import { GameConfig } from '../../types/config';

describe('PlayerStateManager', () => {
  let playerStateManager: PlayerStateManager;
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

    playerStateManager = new PlayerStateManager(mockConfig);
  });

  test('should create initial state correctly', () => {
    const state = playerStateManager.getState();
    expect(state.position.x).toBe(mockConfig.canvas.width / 2);
    expect(state.position.y).toBe(mockConfig.canvas.height - mockConfig.player.size.height);
    expect(state.health).toBe(mockConfig.player.initialHealth);
    expect(state.lives).toBe(mockConfig.player.lives);
  });

  test('should update position correctly', () => {
    const newPosition = { x: 100, y: 200 };
    playerStateManager.updatePosition(newPosition);
    expect(playerStateManager.getState().position).toEqual(newPosition);
  });

  test('should update health correctly', () => {
    const newHealth = 50;
    playerStateManager.updateHealth(newHealth);
    expect(playerStateManager.getState().health).toBe(newHealth);
  });

  test('should reset state correctly', () => {
    playerStateManager.updateHealth(50);
    playerStateManager.updatePosition({ x: 100, y: 100 });
    
    playerStateManager.reset(mockConfig);
    
    const state = playerStateManager.getState();
    expect(state.health).toBe(mockConfig.player.initialHealth);
    expect(state.position.x).toBe(mockConfig.canvas.width / 2);
    expect(state.position.y).toBe(mockConfig.canvas.height - mockConfig.player.size.height);
  });
}); 