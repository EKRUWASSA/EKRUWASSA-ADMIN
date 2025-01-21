import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuild: {
      loader: { '.js': 'jsx' }  // This is crucial for handling JSX in .js files
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /\.(js|jsx)$/,
    exclude: /node_modules/,
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
});