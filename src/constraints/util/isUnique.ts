import { isDeepStrictEqual } from 'node:util';
import uniqWith from 'lodash.uniqwith';

export function isUnique(input: unknown[]) {
	if (input.length < 2) return true;
	// TODO: replace with hash
	const uniqueArray = uniqWith(input, isDeepStrictEqual);
	return uniqueArray.length === input.length;
}
