import vue from '@vitejs/plugin-vue';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	{
		extends: 'vitest.config.ts',
		test: {
			include: ['tests/unit/**/*.test.ts'],
			name: 'unit',
			environment: 'node'
		}
	},
	{
		plugins: [vue(), nodePolyfills()],
		test: {
			includeTaskLocation: true,
			setupFiles: ['tests/browser/vitest-setup.ts'],
			include: ['tests/browser/**/*.test.ts'],
			name: 'browser',
			globals: true,
			browser: {
				enabled: true,
				name: 'chromium',
				provider: 'playwright'
			}
		},
		esbuild: {
			target: 'es2020'
		}
	}
]);
