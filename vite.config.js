import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Externalize axios so it is not bundled in the final build
      external: ['axios'],
    },
  },
});
