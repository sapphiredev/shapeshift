import { defineEnv } from 'unenv';
import { defineConfig, type Options } from 'tsdown';
import pkgJson from './package.json' with { type: 'json' };

const { env } = defineEnv({ npmShims: false, resolve: false });

const baseOptions = {
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	minify: 'dce-only',
	sourcemap: true,
	target: 'node20',

	inputOptions: {
		resolve: { alias: env.alias },
		inject: env.inject as never,
		external: [...(env.external as never[]), ...Object.keys(pkgJson.dependencies)]
	}
} satisfies Options;

export default defineConfig([
	{
		...baseOptions,
		outDir: 'dist/cjs',
		format: 'cjs',
		fixedExtension: true
	},
	{
		...baseOptions,
		outDir: 'dist/esm',
		format: 'esm',
		fixedExtension: true
	},
	{
		...baseOptions,
		globalName: 'SapphireShapeshift',
		outputOptions: {
			entryFileNames: 'index.global.js'
		},
		dts: false,
		minify: true,
		sourcemap: false,
		target: 'es2020',
		outDir: 'dist/iife',
		format: 'iife',
		// we either have to bundle all dependencies or allow passing them in via the global scope
		noExternal: [/.+/],
		inputOptions: { ...baseOptions.inputOptions, external: env.external as never }
	}
]);
