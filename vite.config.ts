import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // порт 3000 занят бэкендом
    proxy: {
      '/api': 'http://localhost:3000', // веб-сервис
      '/masonry-material-media': 'http://localhost:9000', // бакет MinIO с изображениями и видео
    },
  },
});
