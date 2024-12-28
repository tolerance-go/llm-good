import { GameConfig } from '../../types/config';
import { UIState } from '../../types/state';
import { EventService } from '../../core/services/EventService';
import { LogCollector } from '../../utils/LogCollector';

export class StartButtonStateController {
  private config: GameConfig;
  private eventService: EventService;
  private logger: LogCollector;

  constructor(config: GameConfig) {
    this.config = config;
    this.eventService = EventService.getInstance();
    this.logger = LogCollector.getInstance();
    this.logger.addLog('StartButtonStateController', '初始化开始按钮状态控制器');
  }

  /**
   * 获取开始按钮状态
   */
  getButtonState(screen: 'menu' | 'game' | 'pause' | 'gameOver'): UIState['startButtonState'] {
    this.logger.addLog('StartButtonStateController', `获取${screen}场景按钮状态`);
    
    return {
      visible: this.isButtonVisible(screen),
      text: this.getButtonText(screen),
      position: this.getButtonPosition(screen)
    };
  }

  /**
   * 判断按钮在当前场景是否可见
   */
  private isButtonVisible(screen: string): boolean {
    switch (screen) {
      case 'menu':
      case 'gameOver':
        return true;
      case 'game':
      case 'pause':
      default:
        return false;
    }
  }

  /**
   * 获取按钮文本
   */
  private getButtonText(screen: string): string {
    this.logger.addLog('StartButtonStateController', `获取${screen}场景按钮文本`);
    switch (screen) {
      case 'gameOver':
        return '重新开始';
      case 'menu':
      default:
        return '开始游戏';
    }
  }

  /**
   * 获取按钮位置
   */
  private getButtonPosition(screen: string): { x: number; y: number } {
    this.logger.addLog('StartButtonStateController', `获取${screen}场景按钮位置`);
    const baseY = this.config.canvas.height / 2;
    const centerX = this.config.canvas.width / 2;

    switch (screen) {
      case 'gameOver':
        // 游戏结束时按钮位置偏下
        return { 
          x: centerX, 
          y: baseY + 50 
        };
      case 'menu':
      default:
        // 默认在屏幕中央
        return { 
          x: centerX, 
          y: baseY 
        };
    }
  }

  /**
   * 更新按钮状态
   */
  updateState(screen: 'menu' | 'game' | 'pause' | 'gameOver'): void {
    this.logger.addLog('StartButtonStateController', `更新按钮状态: ${screen}`);
    const buttonState = this.getButtonState(screen);
    
    this.logger.addLog('StartButtonStateController', '按钮状态详情:', {
      visible: buttonState.visible,
      text: buttonState.text,
      position: buttonState.position
    });
  }
} 