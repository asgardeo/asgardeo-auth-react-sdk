import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react()
  ],
  optimizeDeps: {
    include: ['@asgardeo/auth-react']
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'public', 'cert', 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'public', 'cert', 'localhost-cert.pem')),
    },
    host: 'localhost',
    port: 3000
  },
  build: {
    commonjsOptions: { include: [] },
    // commonjsOptions: { },                               // Edit: 
  },   
})
