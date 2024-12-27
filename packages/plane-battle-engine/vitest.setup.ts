import { vi } from 'vitest';

// Mock Phaser
vi.mock('phaser', () => ({
  default: {
    Game: class {
      destroy() {}
    },
    AUTO: 'AUTO',
    Scene: class {},
  },
})); 