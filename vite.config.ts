import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		}
	},
  optimizeDeps: {
    exclude: ['js-big-decimal']
  }
});
