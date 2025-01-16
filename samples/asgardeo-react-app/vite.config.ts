import { defineConfig, loadEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')

  // Explicitly define the configuration type
  const config: UserConfig = {
    plugins: [react()],
    optimizeDeps: {
      include: [
        '@asgardeo/auth-react',
        'react/jsx-runtime',
        'react-router',
        'react-router-dom',
        'react',
      ],
    },
    server: {
      host: env.HOST,
      port: parseInt(env.PORT || '3000', 10),
    },
    build: {
      commonjsOptions: {
        include: [/react/],
      },
    },
  };

  if (env.HTTPS === 'true') {
    config.server = {
      ...config.server,
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'public', 'cert', 'localhost-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'public', 'cert', 'localhost-cert.pem')),
      },
    };
  }

  return config;
});
