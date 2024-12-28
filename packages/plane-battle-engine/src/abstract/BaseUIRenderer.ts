import { Container, Application } from 'pixi.js';
import { GameState } from '../types/state';
import { GameConfig } from '../types/config';
import { RenderStats } from '../types/renderers';

export abstract class BaseUIRenderer {
  protected container: Container | null = null;
  protected app: Application | null = null;
  protected config: GameConfig | null = null;
  protected debugMode: boolean = false;

  abstract initialize(config: GameConfig, canvas?: HTMLCanvasElement): void;
  abstract setContainer(container: Container, app: Application): void;
  abstract render(state: GameState): void;
  abstract destroy(): void;

  public setDebug(enabled: boolean): void {
    this.debugMode = enabled;
  }

  public getStats(): RenderStats {
    return {
      fps: 0,
      drawCalls: 1,
      entities: 1
    };
  }
} 