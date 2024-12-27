import { describe, it, expect, beforeEach } from 'vitest';
import { BulletStateManager } from '../BulletStateManager';
import { GameConfig, Vector2D } from '../../types';

describe('BulletStateManager', () => {
  let bulletManager: BulletStateManager;
  const defaultConfig: GameConfig = {
    canvas: {
      width: 800,
      height: 600,
      backgroundColor: '#000000'
    },
    weapons: {
      fireRate: 2,
      bulletSpeed: 10,
      bulletDamage: 20,
      bulletSize: { width: 8, height: 8 }
    }
  } as GameConfig;

  beforeEach(() => {
    bulletManager = new BulletStateManager(defaultConfig);
  });

  describe('子弹创建', () => {
    it('应该能够正确创建玩家子弹', () => {
      const position: Vector2D = { x: 100, y: 200 };
      const bullet = bulletManager.createPlayerBullet(position);

      expect(bullet.position).toEqual(position);
      expect(bullet.isPlayerBullet).toBe(true);
      expect(bullet.damage).toBe(defaultConfig.weapons.bulletDamage);
      expect(bullet.size).toEqual(defaultConfig.weapons.bulletSize);
      expect(bullet.velocity.y).toBe(-defaultConfig.weapons.bulletSpeed * 300); // 检查向上移动
      expect(bullet.active).toBe(true);
    });
  });

  describe('子弹管理', () => {
    it('应该能够添加和获取子弹', () => {
      const position: Vector2D = { x: 100, y: 200 };
      const bullet = bulletManager.createPlayerBullet(position);
      
      bulletManager.addBullet(bullet);
      const bullets = bulletManager.getBullets();
      
      expect(bullets).toHaveLength(1);
      expect(bullets[0]).toEqual(bullet);
    });

    it('应该能够移除子弹', () => {
      const position: Vector2D = { x: 100, y: 200 };
      const bullet = bulletManager.createPlayerBullet(position);
      
      bulletManager.addBullet(bullet);
      bulletManager.removeBullet(bullet.id);
      
      expect(bulletManager.getBullets()).toHaveLength(0);
    });

    it('应该能够重置子弹状态', () => {
      const position: Vector2D = { x: 100, y: 200 };
      const bullet = bulletManager.createPlayerBullet(position);
      
      bulletManager.addBullet(bullet);
      bulletManager.reset();
      
      expect(bulletManager.getBullets()).toHaveLength(0);
    });
  });

  describe('子弹位置更新', () => {
    it('应该正确更新子弹位置', () => {
      const position: Vector2D = { x: 400, y: 300 };
      const bullet = bulletManager.createPlayerBullet(position);
      bulletManager.addBullet(bullet);

      const deltaTime = 1/60; // 模拟60fps
      bulletManager.updateBulletPositions(deltaTime, defaultConfig.canvas.width, defaultConfig.canvas.height);

      const bullets = bulletManager.getBullets();
      expect(bullets[0].position.y).toBeLessThan(position.y); // 子弹应该向上移动
    });

    it('应该移除超出画布的子弹', () => {
      // 创建一个位于画布边缘的子弹
      const bullet1 = bulletManager.createPlayerBullet({ x: 400, y: -10 });
      const bullet2 = bulletManager.createPlayerBullet({ x: 400, y: 300 });
      
      bulletManager.addBullet(bullet1);
      bulletManager.addBullet(bullet2);
      
      bulletManager.updateBulletPositions(1/60, defaultConfig.canvas.width, defaultConfig.canvas.height);
      
      const bullets = bulletManager.getBullets();
      expect(bullets).toHaveLength(1); // 只有一个子弹应该保留
      expect(bullets[0].id).toBe(bullet2.id);
    });
  });

  describe('配置更新', () => {
    it('应该能够更新配置', () => {
      const newConfig = {
        ...defaultConfig,
        weapons: {
          ...defaultConfig.weapons,
          bulletDamage: 30,
          bulletSpeed: 15
        }
      };

      bulletManager.updateConfig(newConfig);
      const bullet = bulletManager.createPlayerBullet({ x: 0, y: 0 });
      
      expect(bullet.damage).toBe(30);
      expect(bullet.velocity.y).toBe(-15 * 300);
    });
  });
}); 