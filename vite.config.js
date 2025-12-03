import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/pi-planning/', // project page base
  plugins: [react()],
});
