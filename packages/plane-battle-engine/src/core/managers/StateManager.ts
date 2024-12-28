/**
 * @class StateManager
 * @description 状态管理器 - 负责管理游戏的整体状态
 * 
 * @responsibility
 * - 管理和维护游戏的全局状态
 * - 协调各个子状态管理器
 * - 处理状态的初始化、更新和重置
 * - 通过事件中心通知状态变更
 * 
 * @dependencies
 * - GameState: 游戏状态类型
 * - GameConfig: 游戏配置
 * - EventCenter: 事件中心
 * - GameStateManager: 游戏状态管理器
 * - PlayerStateManager: 玩家状态管理器
 * - EnemyStateManager: 敌人状态管理器
 * - BulletStateManager: 子弹状态管理器
 * 
 * @usedBy
 * - GameEngine: 游戏引擎使用状态管理器维护游戏状态
 * - CommandCenter: 命令中心通过状态管理器修改游戏状态
 * - ResponseManager: 响应管理器通过状态管理器获取当前状态
 * 
 * @features
 * - 状态的原子性更新
 * - 状态变更事件通知
 * - 子状态管理器的协调
 * - 性能指标的跟踪
 */

import { GameState, GameStatus } from '../../types/state';
import { GameConfig } from '../../types/config';
import { EventService } from '../services/EventService';
import { GameEventType } from '../../types/events';
import { GameStateController } from '../../states/GameStateController';
import { PlayerStateController } from '../../states/PlayerStateController';
import { EnemyStateController } from '../../states/EnemyStateController';
import { BulletStateControllerr } from '../../states/BulletStateControllerr';

export class StateManager {
  private state: GameState;
  private config: GameConfig;
  private eventCenter: EventService;
  private gameStateManager: GameStateController;
  private playerStateManager: PlayerStateController;
  private enemyStateManager: EnemyStateController;
  private bulletStateManager: BulletStateControllerr;

  constructor(config: GameConfig) {
    this.config = config;
    this.eventCenter = EventService.getInstance();
    this.gameStateManager = new GameStateController(config);
    this.playerStateManager = new PlayerStateController(config);
    this.enemyStateManager = new EnemyStateController(config);
    this.bulletStateManager = new BulletStateControllerr(config);
    this.state = this.initializeState();
  }

  private initializeState(): GameState {
    return {
      status: 'init',
      currentLevel: 1,
      currentWave: 1,
      score: 0,
      time: 0,
      isPaused: false,
      isGameOver: false,
      performance: {
        fps: 0,
        frameTime: 0,
        updateTime: 0,
        renderTime: 0
      },
      player: {
        id: 'player',
        health: this.config.player.initialHealth,
        lives: this.config.player.lives,
        position: {
          x: this.config.canvas.width / 2,
          y: this.config.canvas.height - this.config.player.size.height * 2
        },
        velocity: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1 },
        size: this.config.player.size,
        speed: this.config.player.speed,
        score: 0,
        fireRate: this.config.player.fireRate,
        lastFireTime: 0,
        powerups: [],
        invincible: false,
        respawning: false,
        active: true,
        combo: {
          count: 0,
          timer: 0,
          multiplier: 1
        },
        weapons: {
          bulletSpeed: this.config.weapons.bulletSpeed,
          bulletDamage: this.config.weapons.bulletDamage
        }
      },
      enemies: [],
      bullets: [],
      powerups: [],
      input: {
        type: 'move',
        data: {
          x: 0,
          y: 0,
          pressed: false
        }
      },
      ui: {
        currentScreen: 'menu',
        elements: {
          mainMenu: true,
          startButton: true,
          optionsButton: true,
          scoreDisplay: false,
          pauseMenu: false,
          gameOverScreen: false
        }
      }
    };
  }

  getState(): GameState {
    return this.state;
  }

  setState(newState: Partial<GameState>): void {
    Object.assign(this.state, newState);
    this.eventCenter.emit(GameEventType.STATE_CHANGE, this.state);
  }

  updateState(deltaTime: number): void {
    // 更新游戏状态
    if (this.state.status === 'playing') {
      this.state.time += deltaTime;

      // 更新性能指标
      this.state.performance = {
        fps: 1000 / deltaTime,
        frameTime: deltaTime,
        updateTime: performance.now(),
        renderTime: 0
      };

      // 更新游戏状态
      this.gameStateManager.update(this.state);

      // 更新各个实体状态
      if (!this.state.isPaused && !this.state.isGameOver) {
        this.playerStateManager.update(this.state);
        this.enemyStateManager.update(this.state);
        this.bulletStateManager.update(this.state);
      }

      // 发送状态更新事件
      this.eventCenter.emit(GameEventType.STATE_CHANGE, this.state);
    }
  }

  resetState(): void {
    this.state = this.initializeState();
    this.eventCenter.emit(GameEventType.STATE_CHANGE, this.state);
  }

  getGameStatus(): GameStatus {
    return this.state.status;
  }

  setGameStatus(status: GameStatus): void {
    this.state.status = status;
    this.eventCenter.emit(GameEventType.STATE_CHANGE, this.state);
  }
} 