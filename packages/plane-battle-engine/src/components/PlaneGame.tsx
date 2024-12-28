import React, { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import { GameEngine } from '../core/GameEngine';
import { DEFAULT_CONFIG } from '../types/config';
import type { GameConfig } from '../types/config';
import type { GameState } from '../types/state';
import { GameEventType } from '../types/events';

interface PlaneGameProps {
  config?: Partial<GameConfig>;
  onStateChange?: (state: GameState) => void;
}

interface PlaneGameHandle {
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  getCurrentState: () => GameState | null;
  updateConfig: (config: Partial<GameConfig>) => void;
}

const PlaneGame = forwardRef<PlaneGameHandle, PlaneGameProps>(({
  config = {},
  onStateChange,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 设置配置
    const mergedConfig: GameConfig = {
      ...DEFAULT_CONFIG,
      ...config,
      canvas: {
        ...DEFAULT_CONFIG.canvas,
        ...config.canvas,
        width: 800,  // 使用固定的初始尺寸
        height: 600
      }
    };

    // 初始化游戏引擎
    try {
      engineRef.current = new GameEngine(mergedConfig, containerRef.current);

      // 添加状态变化监听
      if (onStateChange) {
        engineRef.current.on(GameEventType.STATE_CHANGE, onStateChange);
      }
    } catch (error) {
      console.error('游戏引擎初始化失败:', error);
    }

    return () => {
      engineRef.current?.resetGame();
      engineRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    pauseGame: () => {
      engineRef.current?.pauseGame();
    },
    resumeGame: () => {
      engineRef.current?.resumeGame();
    },
    resetGame: () => {
      engineRef.current?.resetGame();
    },
    getCurrentState: () => engineRef.current?.getState() || null,
    updateConfig: (newConfig) => {
      engineRef.current?.updateConfig(newConfig);
    }
  }));

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        backgroundColor: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    />
  );
});

PlaneGame.displayName = 'PlaneGame';

export default PlaneGame; 