import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

// Plugin to handle CSS imports in tests
const cssMockPlugin = () => ({
  name: 'css-mock',
  enforce: 'pre' as const,
  load(id: string) {
    if (id.endsWith('.css')) {
      return 'export default {}';
    }
  },
  resolveId(id: string) {
    if (id.endsWith('.css')) {
      return id;
    }
  },
});

export default defineConfig({
  plugins: [vue(), cssMockPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      'node_modules/',
      'dist/',
      'coverage/',
      'tests/**/*',
      'tests-examples/**/*',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'coverage/',
        'tests/**/*',
        'tests-examples/**/*',
      ],
    },
    css: {
      // Mock CSS imports during testing to avoid "Unknown file extension .css" errors
      mock: true,
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
