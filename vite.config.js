import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Ajuste 'estimativa-parametrica' para o nome exato do seu repositório GitHub
  base: '/estimativa-parametrica/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 2000,
  },
})
