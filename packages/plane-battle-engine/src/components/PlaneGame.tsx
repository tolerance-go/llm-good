import React, { forwardRef, useRef, useEffect, useImperativeHandle, useState } from 'react';
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
  const [gameStatus, setGameStatus] = useState<'init' | 'loading' | 'ready' | 'playing' | 'paused' | 'gameOver'>('init');

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

    setGameStatus('loading');

    // 初始化游戏引擎
    try {
      engineRef.current = new GameEngine(mergedConfig, containerRef.current);

      // 添加状态变化监听
      if (onStateChange) {
        engineRef.current.on(GameEventType.STATE_CHANGE, onStateChange);
      }

      // 添加游戏结束监听
      engineRef.current.on(GameEventType.GAME_OVER, () => {
        setGameStatus('gameOver');
      });

      setGameStatus('ready');
    } catch (error) {
      console.error('游戏引擎初始化失败:', error);
      setGameStatus('init');
    }

    return () => {
      engineRef.current?.resetGame();
      engineRef.current = null;
    };
  }, []);

  const startGame = () => {
    if (engineRef.current) {
      engineRef.current.startGame();
      setGameStatus('playing');
    }
  };

  useImperativeHandle(ref, () => ({
    pauseGame: () => {
      if (engineRef.current) {
        engineRef.current.pauseGame();
        setGameStatus('paused');
      }
    },
    resumeGame: () => {
      if (engineRef.current) {
        engineRef.current.resumeGame();
        setGameStatus('playing');
      }
    },
    resetGame: () => {
      if (engineRef.current) {
        engineRef.current.resetGame();
        setGameStatus('ready');
      }
    },
    getCurrentState: () => engineRef.current?.getState() || null,
    updateConfig: (newConfig) => {
      if (engineRef.current) {
        engineRef.current.updateConfig(newConfig);
      }
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
    >
      {gameStatus === 'loading' && (
        <div style={{ color: 'white', fontSize: '20px' }}>
          加载中...
        </div>
      )}
      {gameStatus === 'ready' && (
        <button
          onClick={startGame}
          style={{
            position: 'absolute',
            padding: '15px 30px',
            fontSize: '20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: 1
          }}
        >
          开始游戏
        </button>
      )}
      {gameStatus === 'gameOver' && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            zIndex: 1
          }}
        >
          <h2 style={{ color: 'white', margin: 0 }}>游戏结束</h2>
          <button
            onClick={() => {
              if (engineRef.current) {
                engineRef.current.resetGame();
                engineRef.current.startGame();
                setGameStatus('playing');
              }
            }}
            style={{
              padding: '15px 30px',
              fontSize: '20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            重新开始
          </button>
        </div>
      )}
    </div>
  );
});

PlaneGame.displayName = 'PlaneGame';

export default PlaneGame; 