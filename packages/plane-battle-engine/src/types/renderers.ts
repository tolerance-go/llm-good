import { GameState } from './state';
import { GameConfig } from './config';

// 渲染统计信息
export interface RenderStats {
  fps: number;
  drawCalls: number;
  entities: number;
}

// 玩家输入类型
export interface PlayerInput {
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
}

// 渲染器接口
export interface GameRenderer {
  // 初始化渲染器
  initialize(config: GameConfig, canvas: HTMLCanvasElement): void;
  
  // 清理资源
  destroy(): void;
  
  // 渲染游戏状态
  render(state: GameState): void;
  
  // 获取渲染统计信息
  getStats(): RenderStats;
  
  // 调试模式切换
  setDebug(enabled: boolean): void;
} 