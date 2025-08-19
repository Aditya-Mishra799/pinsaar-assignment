import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { allowedHosts: ["5173-adityamishr-pinsaarassi-ohur6zriz0s.ws-us121.gitpod.io"] }
})
