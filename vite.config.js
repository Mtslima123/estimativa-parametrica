import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/estimativa-parametrica/', // deve ser igual ao nome do repositório no GitHub
})
