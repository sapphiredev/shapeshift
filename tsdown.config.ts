import { defineConfig } from 'tsdown';

export default defineConfig({
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	format: 'esm',
	outDir: 'dist',
	sourcemap: true,
	target: 'es2020',
	tsconfig: 'src/tsconfig.json'
});
