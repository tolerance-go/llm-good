import { GameState, UIState, GameStatus } from './state';
import { GameConfig } from './config';
import { PlayerInput } from './renderers';

// 事件处理器类型
export type GameEventHandler<T = unknown> = (data: T) => void;

// 事件名称枚举
export enum GameEventType {
  // 游戏状态事件
  GAME_INIT = 'game:init',
  GAME_START = 'game:start',
  GAME_PAUSE = 'game:pause',
  GAME_RESUME = 'game:resume',
  GAME_OVER = 'game:over',
  GAME_RESET = 'game:reset',
  
  // 玩家相关事件
  PLAYER_MOVE = 'player:move',
  PLAYER_SHOOT = 'player:shoot',
  PLAYER_HIT = 'player:hit',
  PLAYER_DEAD = 'player:dead',
  PLAYER_RESPAWN = 'player:respawn',
  PLAYER_POWERUP = 'player:powerup',
  
  // 敌人相关事件
  ENEMY_SPAWN = 'enemy:spawn',
  ENEMY_MOVE = 'enemy:move',
  ENEMY_SHOOT = 'enemy:shoot',
  ENEMY_HIT = 'enemy:hit',
  ENEMY_DEAD = 'enemy:dead',
  
  // 碰撞事件
  COLLISION_PLAYER_ENEMY = 'collision:player-enemy',
  COLLISION_BULLET_ENEMY = 'collision:bullet-enemy',
  COLLISION_BULLET_PLAYER = 'collision:bullet-player',
  
  // 游戏进程事件
  LEVEL_START = 'level:start',
  LEVEL_COMPLETE = 'level:complete',
  WAVE_START = 'wave:start',
  WAVE_COMPLETE = 'wave:complete',
  SCORE_CHANGE = 'score:change',
  
  // 系统事件
  CONFIG_CHANGE = 'system:config-change',
  STATE_CHANGE = 'system:state-change',
  UI_STATE_CHANGE = 'system:ui-state-change',
  RUN_STATE_CHANGE = 'system:run-state-change',
  INPUT_CHANGE = 'system:input-change',
  RENDER_FRAME = 'system:render-frame',
  ERROR = 'system:error'
}

// 事件数据类型
export interface GameEventData {
  [GameEventType.GAME_INIT]: GameConfig;
  [GameEventType.GAME_START]: void;
  [GameEventType.GAME_PAUSE]: void;
  [GameEventType.GAME_RESUME]: void;
  [GameEventType.GAME_OVER]: { score: number; reason: string };
  [GameEventType.GAME_RESET]: void;
  
  [GameEventType.PLAYER_MOVE]: PlayerInput;
  [GameEventType.PLAYER_SHOOT]: { position: { x: number; y: number } };
  [GameEventType.PLAYER_HIT]: { damage: number; source: string };
  [GameEventType.PLAYER_DEAD]: void;
  [GameEventType.PLAYER_RESPAWN]: { position: { x: number; y: number } };
  [GameEventType.PLAYER_POWERUP]: { type: string; duration: number };
  
  [GameEventType.ENEMY_SPAWN]: { type: string; position: { x: number; y: number } };
  [GameEventType.ENEMY_MOVE]: { id: string; position: { x: number; y: number } };
  [GameEventType.ENEMY_SHOOT]: { id: string; position: { x: number; y: number } };
  [GameEventType.ENEMY_HIT]: { id: string; damage: number };
  [GameEventType.ENEMY_DEAD]: { id: string; score: number };
  
  [GameEventType.COLLISION_PLAYER_ENEMY]: { enemyId: string };
  [GameEventType.COLLISION_BULLET_ENEMY]: { bulletId: string; enemyId: string };
  [GameEventType.COLLISION_BULLET_PLAYER]: { bulletId: string };
  
  [GameEventType.LEVEL_START]: { level: number };
  [GameEventType.LEVEL_COMPLETE]: { level: number; score: number };
  [GameEventType.WAVE_START]: { wave: number };
  [GameEventType.WAVE_COMPLETE]: { wave: number };
  [GameEventType.SCORE_CHANGE]: { score: number; delta: number };
  
  [GameEventType.CONFIG_CHANGE]: GameConfig;
  [GameEventType.STATE_CHANGE]: GameState;
  [GameEventType.UI_STATE_CHANGE]: {
    type: 'visibility';
    value: {
      currentScreen: UIState['currentScreen'];
      elements: UIState['elements'];
      startButtonState?: UIState['startButtonState'];
    };
  };
  [GameEventType.RUN_STATE_CHANGE]: {
    type: 'status';
    value: {
      status?: GameStatus;
      isPaused?: boolean;
      isGameOver?: boolean;
    };
  };
  [GameEventType.INPUT_CHANGE]: PlayerInput;
  [GameEventType.RENDER_FRAME]: { deltaTime: number };
  [GameEventType.ERROR]: { code: string; message: string };
} 