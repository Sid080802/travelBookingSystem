import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/graphql': 'https://your-backend-url.vercel.app', // Replace with actual backend URL
    },
  },
});
