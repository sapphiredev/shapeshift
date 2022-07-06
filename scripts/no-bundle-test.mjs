/**
 * A very simple file that can run without having a node_modules directory
 * This way we can validate from a NodeJS environment that the bundle will
 * work completely standalone
 */

import assert from 'node:assert/strict';
import { ExpectedConstraintError, s } from '../dist/index.mjs';

const uniqSchema = s.array(s.string).unique;
const goodData = ['a', 'b', 'c'];
const badData = ['a', 'b', 'a'];

assert.deepStrictEqual(uniqSchema.parse(goodData), goodData);

assert.throws(() => uniqSchema.parse(badData), ExpectedConstraintError);
