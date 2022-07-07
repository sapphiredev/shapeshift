import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: false,
	entry: ['src/index.ts'],
	format: ['esm', 'cjs', 'iife'],
	minify: false,
	skipNodeModulesBundle: false,
	bundle: true,
	sourcemap: true,
	target: 'es2020',
	tsconfig: 'src/tsconfig.json',
	keepNames: true,
	globalName: 'SapphireShapeshift',
	esbuildOptions: (options, context) => {
		if (context.format === 'cjs') {
			options.banner = {
				js: '"use strict";'
			};
		}
	}
});
