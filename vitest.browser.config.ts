import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'happy-dom',
		dir: './browser-tests'
	},
	esbuild: {
		target: 'es2020'
	}
});
