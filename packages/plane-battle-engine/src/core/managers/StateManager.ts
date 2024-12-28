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
 * - StateController: 状态控制器接口
 */

import { GameState, GameStatus } from '../../types/state';
import { GameConfig } from '../../types/config';
import { EventService } from '../services/EventService';
import { GameEventType } from '../../types/events';
import { GameStateController } from '../../states/GameStateController';
import { PlayerStateController } from '../../states/PlayerStateController';
import { EnemyStateController } from '../../states/EnemyStateController';
import { BulletStateControllerr } from '../../states/BulletStateControllerr';

// 状态控制器接口
interface StateController {
  update(state: GameState): void;
  reset?(state: GameState): void;
  init?(): void;
}

export class StateManager {
  private state: GameState;
  private config: GameConfig;
  private eventCenter: EventService;
  private controllers: StateController[] = [];

  constructor(config: GameConfig, eventService: EventService) {
    this.config = config;
    this.eventCenter = eventService;
    this.state = this.initializeState();
    
    // 初始化所有控制器
    this.controllers = [
      new GameStateController(config, eventService),
      new PlayerStateController(config, eventService),
      new EnemyStateController(config, eventService),
      new BulletStateControllerr(config, eventService),
    ];
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

      // 如果游戏没有暂停且没有结束，更新所有控制器
      if (!this.state.isPaused && !this.state.isGameOver) {
        for (const controller of this.controllers) {
          controller.update(this.state);
        }
      }

      // 发送状态更新事件
      this.eventCenter.emit(GameEventType.STATE_CHANGE, this.state);
    }
  }

  resetState(): void {
    this.state = this.initializeState();
    // 重置所有控制器
    for (const controller of this.controllers) {
      if (controller.reset) {
        controller.reset(this.state);
      }
    }
    this.eventCenter.emit(GameEventType.STATE_CHANGE, this.state);
  }

  // 添加新的控制器
  addController(controller: StateController): void {
    this.controllers.push(controller);
  }

  // 移除控制器
  removeController(controller: StateController): void {
    const index = this.controllers.indexOf(controller);
    if (index !== -1) {
      this.controllers.splice(index, 1);
    }
  }

  getGameStatus(): GameStatus {
    return this.state.status;
  }

  setGameStatus(status: GameStatus): void {
    this.state.status = status;
    this.eventCenter.emit(GameEventType.STATE_CHANGE, this.state);
  }

  // 获取特定类型的控制器
  getController<T extends StateController>(
    controllerType: new (config: GameConfig, eventService: EventService) => T
  ): T | undefined {
    return this.controllers.find((controller): controller is T => controller instanceof controllerType);
  }
} 