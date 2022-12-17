import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';
import { defineConfig as defineTsupConfig } from 'tsup';

export default defineTsupConfig({
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
	esbuildPlugins: [nodeModulesPolyfillPlugin()],
	treeshake: true
});
