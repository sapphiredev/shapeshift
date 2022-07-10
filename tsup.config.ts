import { defineConfig } from 'tsup';
import NodeModulesPolyfills from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	format: ['esm', 'cjs', 'iife'],
	minify: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: 'es2020',
	tsconfig: 'src/tsconfig.json',
	keepNames: true,
	globalName: 'SapphireShapeshift',
	// @ts-expect-error it's exported as default
	esbuildPlugins: [NodeModulesPolyfills.default()],
	esbuildOptions: (options, context) => {
		if (context.format === 'cjs') {
			options.banner = {
				js: '"use strict";'
			};
		}
	}
});
