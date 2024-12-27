import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./apps/game-hub/vitest.config.ts",
  "./apps/game-maker/vitest.config.ts",
  "./apps/frontend/vitest.config.ts",
  "./packages/plane-battle-engine/vitest.config.ts"
])
