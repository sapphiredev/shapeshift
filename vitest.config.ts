import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		includeTaskLocation: true,
		globals: true,
		coverage: {
			provider: 'istanbul',
			enabled: true,
			reporter: ['text', 'lcov'],
			include: ['src/**/*.ts'],
			exclude: ['src/constraints/base/IConstraint.ts', 'src/constraints/type-exports.ts']
		}
	},
	esbuild: {
		target: 'es2020'
	}
});
