import { ConstraintError, ConstraintErrorMessageBuilder } from '../lib/errors/ConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, gt, ge, lt, le, ne } from './util/operators';

function arrayLength<T>(
	comparator: Comparator, //
	name: string,
	messageBuilder: ConstraintErrorMessageBuilder<T[]>,
	length: number
): IConstraint<T[]> {
	return {
		run(input: T[]) {
			return comparator(input.length, length) //
				? Result.ok(input)
				: Result.err(new ConstraintError(name, messageBuilder(input, length), input, length));
		}
	};
}

export const arrayLengthLt = arrayLength.bind(
	null,
	lt,
	'arrayLengthLt',
	(given, expected) => `Expected array to have less than ${expected} elements, but received one with ${given.length} elements.`
);

export const arrayLengthLe = arrayLength.bind(
	null,
	le,
	'arrayLengthLe',
	(given, expected) => `Expected array to have maximum ${expected} elements, but received one with ${given.length} elements.`
);

export const arrayLengthGt = arrayLength.bind(
	null,
	gt,
	'arrayLengthGt',
	(given, expected) => `Expected array to have more than ${expected} elements, but received one with ${given.length} elements.`
);

export const arrayLengthGe = arrayLength.bind(
	null,
	ge,
	'arrayLengthGe',
	(given, expected) => `Expected array to have at least ${expected} elements, but received one with ${given.length} elements.`
);

export const arrayLengthEq = arrayLength.bind(
	null,
	eq,
	'arrayLengthEq',
	(given, expected) => `Expected array to have exactly ${expected} elements, but received one with ${given.length} elements.`
);

export const arrayLengthNe = arrayLength.bind(
	null,
	ne,
	'arrayLengthNe',
	(given, expected) => `Expected array to not have exactly ${expected} elements, but received one with ${given.length} elements.`
);
