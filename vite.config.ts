import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base './' so the built site works from any sub-path (GitHub Pages serves it under /<repo>/).
export default defineConfig({
  base: './',
  plugins: [react()],
  // ponytail: one bundle (~1.2 MB gzipped) so the whole bank works offline; split by area if load time matters.
  build: { chunkSizeWarningLimit: 5000 },
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 600_000,
    hookTimeout: 600_000,
  },
});
