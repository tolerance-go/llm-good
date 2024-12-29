import { LogCollector } from '../../utils/LogCollector';
import { GameEventType } from '../../types/events';
import { EventService } from './EventService';

export interface GameLoopCallback {
  (deltaTime: number): void;
}

export class GameLoopService {
  private lastTime: number = 0;
  private animationFrameId: number | null = null;
  private logger: LogCollector;
  private isRunning: boolean = false;

  constructor(private eventService: EventService) {
    this.logger = LogCollector.getInstance();
    this.logger.addLog('GameLoopService', '初始化游戏循环服务');
  }

  private loop = (timestamp: number): void => {
    if (!this.isRunning) return;

    const deltaTime = this.lastTime ? (timestamp - this.lastTime) / 1000 : 0;
    this.lastTime = timestamp;

    // 发送游戏循环更新事件
    this.eventService.emit(GameEventType.GAME_UPDATE, { deltaTime });

    // 发送渲染帧事件
    this.eventService.emit(GameEventType.RENDER_FRAME, { deltaTime });

    // 继续游戏循环
    if (this.isRunning) {
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  }

  public start(): void {
    if (this.isRunning) return;
    
    this.logger.addLog('GameLoopService', '启动游戏循环');
    this.isRunning = true;
    this.lastTime = 0;
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  public stop(): void {
    if (!this.isRunning) return;

    this.logger.addLog('GameLoopService', '停止游戏循环');
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public isActive(): boolean {
    return this.isRunning;
  }

  public destroy(): void {
    this.stop();
    this.logger.addLog('GameLoopService', '销毁游戏循环服务');
  }
} 