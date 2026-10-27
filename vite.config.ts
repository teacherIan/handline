import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The lab: `npm run dev`, then http://localhost:5180
export default defineConfig({
  root: 'lab',
  plugins: [react()],
  server: { port: 5180 },
});
