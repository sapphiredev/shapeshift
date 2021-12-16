import { ConstraintError, ConstraintErrorMessageBuilder } from '../lib/errors/ConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, ge, gt, le, lt, ne } from './util/operators';

function bigintComparator(
	comparator: Comparator,
	name: string,
	messageBuilder: ConstraintErrorMessageBuilder<bigint>,
	number: bigint
): IConstraint<bigint> {
	return {
		run(input: bigint) {
			return comparator(input, number) //
				? Result.ok(input)
				: Result.err(new ConstraintError(name, messageBuilder(input, number), input, number));
		}
	};
}

export const bigintLt = bigintComparator.bind(
	null,
	lt,
	'bigintLt',
	(given, expected) => `Expected bigint to be less than ${expected}, but received ${given}`
);

export const bigintLe = bigintComparator.bind(
	null,
	le,
	'bigintLe',
	(given, expected) => `Expected bigint to be less or equals than ${expected}, but received ${given}`
);

export const bigintGt = bigintComparator.bind(
	null,
	gt,
	'bigintGt',
	(given, expected) => `Expected bigint to be greater than ${expected}, but received ${given}`
);

export const bigintGe = bigintComparator.bind(
	null,
	ge,
	'bigintGe',
	(given, expected) => `Expected bigint to be greater or equals than ${expected}, but received ${given}`
);

export const bigintEq = bigintComparator.bind(
	null,
	eq,
	'bigintEq',
	(given, expected) => `Expected bigint to be exactly ${expected}, but received ${given}`
);

export const bigintNe = bigintComparator.bind(null, ne, 'bigintNe', (_, expected) => `Expected bigint to not be ${expected}`);
