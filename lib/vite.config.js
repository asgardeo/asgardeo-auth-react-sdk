import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    build: {
      sourcemap: isProduction ? false : 'eval-cheap-module-source-map',
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'AsgardeoAuth',
        fileName: 'main',
        formats: ['umd']
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react-router-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-router-dom': 'ReactRouter'
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    esbuild: {
      jsxInject: `import React from 'react'` // Optional: If you use JSX without importing React
    },
    server: {
      strictPort: true,
      port: 3000
    }
  };
});
