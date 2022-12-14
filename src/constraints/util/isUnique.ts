import fastDeepEqual from 'fast-deep-equal/es6/index.js';
import uniqWith from 'lodash/uniqWith.js';

export function isUnique(input: unknown[]) {
	if (input.length < 2) return true;
	const uniqueArray = uniqWith(input, fastDeepEqual);
	return uniqueArray.length === input.length;
}
