import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx', // Tell esbuild to handle `.js` files as JSX
        '.jsx': 'jsx',
      },
    },
  },
  esbuild: {
    loader: 'jsx', // Apply JSX loader globally
    include: /\.(js|jsx)$/, // Include .js and .jsx files
    exclude: /node_modules/, // Exclude node_modules
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Automatically resolve .js and .jsx extensions
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/], // Include node_modules for CommonJS compatibility
      transformMixedEsModules: true, // Allow transformation of mixed ESModules
    },
  },
});
