import fastDeepEqual from 'fast-deep-equal';
import uniqWith from 'lodash.uniqwith';

export function isUnique(input: unknown[]) {
	if (input.length < 2) return true;
	const uniqueArray = uniqWith(input, fastDeepEqual);
	return uniqueArray.length === input.length;
}
