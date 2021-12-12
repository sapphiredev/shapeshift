import { ConstraintError, ConstraintErrorMessageBuilder } from '../lib/errors/ConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, gt, ge, lt, le, ne } from './util/operators';

function numberComparator(
	comparator: Comparator,
	name: string,
	messageBuilder: ConstraintErrorMessageBuilder<number>,
	number: number
): IConstraint<number> {
	return {
		run(input: number) {
			return comparator(input, number) //
				? Result.ok(input)
				: Result.err(new ConstraintError(name, messageBuilder(input, number), input, number));
		}
	};
}

export const numberLt = numberComparator.bind(
	null,
	lt,
	'numberLt',
	(given, expected) => `Expected number to be less than ${expected}, but received ${given}`
);

export const numberLe = numberComparator.bind(
	null,
	le,
	'numberLe',
	(given, expected) => `Expected number to be less or equals than ${expected}, but received ${given}`
);

export const numberGt = numberComparator.bind(
	null,
	gt,
	'numberGt',
	(given, expected) => `Expected number to be greater than ${expected}, but received ${given}`
);

export const numberGe = numberComparator.bind(
	null,
	ge,
	'numberGe',
	(given, expected) => `Expected number to be greater or equals than ${expected}, but received ${given}`
);

export const numberEq = numberComparator.bind(
	null,
	eq,
	'numberEq',
	(given, expected) => `Expected number to be exactly ${expected}, but received ${given}`
);

export const numberNe = numberComparator.bind(null, ne, 'numberNe', (_, expected) => `Expected number to not be ${expected}`);

export const numberInt: IConstraint<number> = {
	run(input: number) {
		return Number.isInteger(input) //
			? Result.ok(input)
			: Result.err(new ConstraintError('numberInt', `Expected number to be an integer, but received ${input}`, input, 'An integer'));
	}
};

export const numberSafeInt: IConstraint<number> = {
	run(input: number) {
		return Number.isSafeInteger(input) //
			? Result.ok(input)
			: Result.err(
					new ConstraintError('numberSafeInt', `Expected number to be a safe integer, but received ${input}`, input, 'A safe integer')
			  );
	}
};

export const numberFinite: IConstraint<number> = {
	run(input: number) {
		return Number.isFinite(input) //
			? Result.ok(input)
			: Result.err(
					new ConstraintError('numberFinite', `Expected number to be a finite number, but received ${input}`, input, 'A finite number')
			  );
	}
};

export const numberNaN: IConstraint<number> = {
	run(input: number) {
		return Number.isNaN(input) //
			? Result.ok(input)
			: Result.err(new ConstraintError('numberNaN', `Expected number to be a NaN, but received ${input}`, input, 'A NaN'));
	}
};

export const numberNeNaN: IConstraint<number> = {
	run(input: number) {
		return Number.isNaN(input) //
			? Result.err(new ConstraintError('numberNeNaN', `Expected number to not be a NaN, but received ${input}`, input, 'Not NaN'))
			: Result.ok(input);
	}
};
