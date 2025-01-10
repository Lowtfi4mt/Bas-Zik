import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
	server: {
		port: 5173,
		host: '0.0.0.0',
		watch: {
			usePolling: true
		}
	}
});
