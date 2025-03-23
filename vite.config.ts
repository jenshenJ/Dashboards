import { defineConfig } from 'vite'
import { resolve } from 'path';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@components': resolve(__dirname, 'src/ui/components'),
      '@assets': resolve(__dirname, 'src/ui/assets')
    }
  }
})
