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
		extends: 'vitest.config.ts',
		plugins: [vue(), nodePolyfills()],
		test: {
			setupFiles: ['tests/browser/vitest-setup.ts'],
			include: ['tests/browser/**/*.test.ts'],
			name: 'browser',
			browser: {
				enabled: true,
				name: 'firefox',
				provider: 'playwright',
				headless: true
			}
		}
	}
]);
