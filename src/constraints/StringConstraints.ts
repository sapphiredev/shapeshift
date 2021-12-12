import { ConstraintError, ConstraintErrorMessageBuilder } from '../lib/errors/ConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, gt, ge, lt, le, ne } from './util/operators';

function stringLength(
	comparator: Comparator,
	name: string,
	messageBuilder: ConstraintErrorMessageBuilder<string>,
	length: number
): IConstraint<string> {
	return {
		run(input: string) {
			return comparator(input.length, length) //
				? Result.ok(input)
				: Result.err(new ConstraintError(name, messageBuilder(input, length), input, length));
		}
	};
}

export const stringLengthLt = stringLength.bind(
	null,
	lt,
	'stringLengthLt',
	(given, expected) => `Expected string to have less than ${expected} characters, but received one with ${given.length} characters`
);

export const stringLengthLe = stringLength.bind(
	null,
	le,
	'stringLengthLe',
	(given, expected) => `Expected string to have maximum ${expected} characters, but received one with ${given.length} characters`
);

export const stringLengthGt = stringLength.bind(
	null,
	gt,
	'stringLengthGt',
	(given, expected) => `Expected string to have more than ${expected} characters, but received one with ${given.length} characters`
);

export const stringLengthGe = stringLength.bind(
	null,
	ge,
	'stringLengthGe',
	(given, expected) => `Expected string to have at least ${expected} characters, but received one with ${given.length} characters`
);

export const stringLengthEq = stringLength.bind(
	null,
	eq,
	'stringLengthEq',
	(given, expected) => `Expected string to have exactly ${expected} characters, but received one with ${given.length} characters`
);

export const stringLengthNe = stringLength.bind(
	null,
	ne,
	'stringLengthNe',
	(given, expected) => `Expected string to not have exactly ${expected} characters, but received one with ${given.length} characters`
);
