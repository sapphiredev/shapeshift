import { defineConfig } from 'tsdown';

export default defineConfig({
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	format: 'esm',
	outDir: 'dist',
	sourcemap: true,
	target: 'es2024',
	tsconfig: 'src/tsconfig.json'
});
