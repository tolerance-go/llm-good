import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.stories.ts', 'src/**/*.stories.tsx', 'src/**/*.test.ts'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PlaneBattleEngine',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'phaser'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          phaser: 'Phaser',
        },
      },
    },
  },
  define: {
    global: 'globalThis',
  },
}); 