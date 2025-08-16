/**
 * Copyright (c) 2025, WSO2 LLC. (https://wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
