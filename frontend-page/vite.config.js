import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true,
    strictPort: true,
    allowedHosts: [
      'inwallz.in',
      'www.inwallz.in',
      'api.inwallz.in',
      'dashboard.inwallz.in',
      'tv.inwallz.in'
    ]
  }
})
