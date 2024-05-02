import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		coverage: {
			provider: 'v8',
			enabled: true,
			reporter: ['text', 'lcov', 'cobertura'],
			include: ['src/**/*.ts'],
			exclude: ['src/constraints/base/IConstraint.ts', 'src/constraints/type-exports.ts']
		}
	},
	esbuild: {
		target: 'es2020'
	}
});
