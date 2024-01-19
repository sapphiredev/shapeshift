import { green } from 'colorette';
import { rename } from 'node:fs/promises';
import { join } from 'node:path';

const inputPath = 'dist/cjs/index.d.ts';
const outputPath = 'dist/cjs/index.d.cts';

const fullInputPathUrl = join(process.cwd(), inputPath);
const fullOutputPathUrl = join(process.cwd(), outputPath);

await rename(fullInputPathUrl, fullOutputPathUrl);

console.log(green(`✅ Renamed index.d.ts to index.d.cts`));
