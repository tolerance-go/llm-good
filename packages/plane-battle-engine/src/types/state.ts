import { Vector2D, Size, Transform } from './base';

export type GameStatus = 'init' | 'menu' | 'playing' | 'paused' | 'gameOver';

export interface UIState {
  currentScreen: 'menu' | 'game' | 'pause' | 'gameOver';
  elements: {
    mainMenu: boolean;
    startButton: boolean;
    optionsButton: boolean;
    scoreDisplay: boolean;
    pauseMenu: boolean;
    gameOverScreen: boolean;
  };
  startButtonState?: {
    visible: boolean;
    text: string;
    position: {
      x: number;
      y: number;
    };
  };
}

export interface GameState {
  status: GameStatus;
  currentLevel: number;
  currentWave: number;
  player: PlayerState;
  enemies: EnemyState[];
  bullets: BulletState[];
  powerups: PowerUpState[];
  input: {
    type: 'move' | 'fire' | 'pause';
    data: {
      x?: number;
      y?: number;
      pressed?: boolean;
    };
    keyboard?: {
      up: boolean;
      down: boolean;
      left: boolean;
      right: boolean;
      space: boolean;
    };
  };
  score: number;
  time: number;
  isPaused: boolean;
  isGameOver: boolean;
  performance: {
    fps: number;
    frameTime: number;
    updateTime: number;
    renderTime: number;
  };
  ui: UIState;
  previousStatus?: GameStatus;
}

export interface PlayerState extends Transform {
  id: string;
  health: number;
  lives: number;
  position: Vector2D;
  size: Size;
  speed: number;
  score: number;
  fireRate: number;
  lastFireTime: number;
  powerups: string[];
  invincible: boolean;
  respawning: boolean;
  velocity: Vector2D;
  active: boolean;
  combo: {
    count: number;
    timer: number;
    multiplier: number;
  };
  weapons: {
    bulletSpeed: number;
    bulletDamage: number;
  };
}

export interface EnemyState extends Transform {
  id: string;
  type: string;
  position: Vector2D;
  size: Size;
  health: number;
  speed: number;
  damage: number;
  scoreValue: number;
  velocity: Vector2D;
  active: boolean;
}

export interface PowerUpState extends Transform {
  id: string;
  type: string;
  position: Vector2D;
  size: Size;
  value: number;
  duration: number;
  active: boolean;
}

export interface BulletState extends Transform {
  id: string;
  position: Vector2D;
  size: Size;
  speed: number;
  damage: number;
  isPlayerBullet: boolean;
  velocity: Vector2D;
  active: boolean;
} 