import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const HOST = process.env.VITE_HOST || 'localhost';
const DEFAULT_PORT = process.env.VITE_PORT || 3000;
const HTTPS = process.env.VITE_HTTPS === 'true';
const devServerHostCheckDisabled = process.env.VITE_DISABLE_DEV_SERVER_HOST_CHECK === 'true';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: HOST,
    port: DEFAULT_PORT,
    https: HTTPS,
    strictPort: false, // Allow dynamic port finding if the default is in use
    open: true, // Automatically open the browser on start
    historyApiFallback: true, // SPA routing support
    cors: devServerHostCheckDisabled ? { origin: '*' } : undefined
  },
  plugins: [react()],
})
