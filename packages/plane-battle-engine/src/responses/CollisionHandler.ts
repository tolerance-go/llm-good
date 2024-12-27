import { BaseResponseHandler } from '../abstract/BaseResponseHandler';
import { GameEventType, GameEventData } from '../types/events';
import { GameState } from '../types/state';
import { GameConfig } from '../types/config';
import { EventService } from '../core/services/EventService';

export class CollisionHandler extends BaseResponseHandler {
  private eventCenter: EventService;

  constructor() {
    super();
    this.eventCenter = EventService.getInstance();
  }

  getName(): string {
    return 'CollisionHandler';
  }

  canHandle(eventType: GameEventType): boolean {
    return [
      GameEventType.COLLISION_PLAYER_ENEMY,
      GameEventType.COLLISION_BULLET_ENEMY,
      GameEventType.COLLISION_BULLET_PLAYER
    ].includes(eventType);
  }

  getPriority(): number {
    return 2;
  }

  handle(eventType: GameEventType, data: GameEventData[GameEventType], state: GameState, config: GameConfig): void {
    if (!this.canHandle(eventType) || !this.isEnabled()) {
      return;
    }

    switch (eventType) {
      case GameEventType.COLLISION_PLAYER_ENEMY:
        this.handlePlayerEnemyCollision(data as GameEventData[GameEventType.COLLISION_PLAYER_ENEMY], state, config);
        break;
      case GameEventType.COLLISION_BULLET_ENEMY:
        this.handleBulletEnemyCollision(data as GameEventData[GameEventType.COLLISION_BULLET_ENEMY], state);
        break;
      case GameEventType.COLLISION_BULLET_PLAYER:
        this.handleBulletPlayerCollision(data as GameEventData[GameEventType.COLLISION_BULLET_PLAYER], state, config);
        break;
    }
  }

  private handlePlayerEnemyCollision(data: GameEventData[GameEventType.COLLISION_PLAYER_ENEMY], state: GameState, config: GameConfig): void {
    const { enemyId } = data;
    const enemy = state.enemies.find(e => e.id === enemyId);
    if (!enemy) return;

    // 玩家受到伤害
    state.player.health -= enemy.damage;
    
    // 检查玩家是否死亡
    if (state.player.health <= 0) {
      state.player.lives--;
      if (state.player.lives <= 0) {
        state.status = 'gameOver';
        this.eventCenter.emit(GameEventType.GAME_OVER, {
          score: state.score,
          reason: 'Player died'
        });
      } else {
        // 重生玩家
        state.player.health = 100;
        state.player.position = { x: config.canvas.width / 2, y: config.canvas.height - 50 };
        state.player.invincible = true;
        state.player.respawning = true;
        
        setTimeout(() => {
          state.player.invincible = false;
          state.player.respawning = false;
        }, 3000);
      }
    }

    // 移除敌人
    state.enemies = state.enemies.filter(e => e.id !== enemyId);
  }

  private handleBulletEnemyCollision(data: GameEventData[GameEventType.COLLISION_BULLET_ENEMY], state: GameState): void {
    const { bulletId, enemyId } = data;
    const enemy = state.enemies.find(e => e.id === enemyId);
    const bullet = state.bullets.find(b => b.id === bulletId);
    
    if (!enemy || !bullet) return;

    // 敌人受到伤害
    enemy.health -= bullet.damage;
    
    // 移除子弹
    state.bullets = state.bullets.filter(b => b.id !== bulletId);

    // 检查敌人是否死亡
    if (enemy.health <= 0) {
      state.enemies = state.enemies.filter(e => e.id !== enemyId);
      state.score += enemy.scoreValue;
      
      this.eventCenter.emit(GameEventType.ENEMY_DEAD, {
        id: enemy.id,
        score: enemy.scoreValue
      });
    }
  }

  private handleBulletPlayerCollision(data: GameEventData[GameEventType.COLLISION_BULLET_PLAYER], state: GameState, config: GameConfig): void {
    const { bulletId } = data;
    const bullet = state.bullets.find(b => b.id === bulletId);
    
    if (!bullet || state.player.invincible) return;

    // 玩家受到伤害
    state.player.health -= bullet.damage;
    
    // 移除子弹
    state.bullets = state.bullets.filter(b => b.id !== bulletId);

    // 检查玩家是否死亡
    if (state.player.health <= 0) {
      state.player.lives--;
      if (state.player.lives <= 0) {
        state.status = 'gameOver';
        this.eventCenter.emit(GameEventType.GAME_OVER, {
          score: state.score,
          reason: 'Player died'
        });
      } else {
        // 重生玩家
        state.player.health = 100;
        state.player.position = { x: config.canvas.width / 2, y: config.canvas.height - 50 };
        state.player.invincible = true;
        state.player.respawning = true;
        
        setTimeout(() => {
          state.player.invincible = false;
          state.player.respawning = false;
        }, 3000);
      }
    }
  }
} 