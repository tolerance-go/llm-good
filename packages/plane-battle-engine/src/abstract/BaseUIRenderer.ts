import { Container, Application } from 'pixi.js';
import { GameState } from '../types/state';
import { GameConfig } from '../types/config';
import { GameRenderer, RenderStats } from '../types/renderers';
import { PixiService } from '../core/services/PixiService';

export abstract class BaseUIRenderer implements GameRenderer {
  protected container: Container | null = null;
  protected app: Application | null = null;
  protected config: GameConfig | null = null;
  protected debugMode: boolean = false;

  abstract initialize(config: GameConfig, pixiService: PixiService): Promise<void>;
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