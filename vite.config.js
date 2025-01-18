import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx', // Set the default loader to handle JSX
    include: /\.(js|jsx)$/, // Apply to both .js and .jsx files
    exclude: /node_modules/, // Exclude node_modules for performance
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Ensure these extensions are resolved
  },
});
