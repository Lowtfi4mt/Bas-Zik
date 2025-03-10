import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
	resolve: {
		alias: {
		  react: 'preact/compat',
		  'react-dom': 'preact/compat',
		},
	  },
	server: {
		port: 5173,
		host: '0.0.0.0',
		watch: {
			usePolling: true
		}
	}
});
