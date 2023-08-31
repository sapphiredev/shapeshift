import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';

import type { IConstraint } from './base/IConstraint';
import { equal, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, notEqual, type Comparator } from './util/operators';

export type NumberConstraintName = `s.number().${
	| 'lessThan'
	| 'lessThanOrEqual'
	| 'greaterThan'
	| 'greaterThanOrEqual'
	| 'equal'
	| 'equal'
	| 'notEqual'
	| 'notEqual'
	| 'int'
	| 'safeInt'
	| 'finite'
	| 'divisibleBy'}(${string})`;

function numberComparator(
	comparator: Comparator,
	name: NumberConstraintName,
	expected: string,
	number: number,
	options?: ValidatorOptions
): IConstraint<number> {
	return {
		run(input: number) {
			return comparator(input, number) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, options?.message ?? 'Invalid number value', input, expected));
		}
	};
}

export function numberLessThan(value: number, options?: ValidatorOptions): IConstraint<number> {
	const expected = `expected < ${value}`;
	return numberComparator(lessThan, 's.number().lessThan()', expected, value, options);
}

export function numberLessThanOrEqual(value: number, options?: ValidatorOptions): IConstraint<number> {
	const expected = `expected <= ${value}`;
	return numberComparator(lessThanOrEqual, 's.number().lessThanOrEqual()', expected, value, options);
}

export function numberGreaterThan(value: number, options?: ValidatorOptions): IConstraint<number> {
	const expected = `expected > ${value}`;
	return numberComparator(greaterThan, 's.number().greaterThan()', expected, value, options);
}

export function numberGreaterThanOrEqual(value: number, options?: ValidatorOptions): IConstraint<number> {
	const expected = `expected >= ${value}`;
	return numberComparator(greaterThanOrEqual, 's.number().greaterThanOrEqual()', expected, value, options);
}

export function numberEqual(value: number, options?: ValidatorOptions): IConstraint<number> {
	const expected = `expected === ${value}`;
	return numberComparator(equal, 's.number().equal()', expected, value, options);
}

export function numberNotEqual(value: number, options?: ValidatorOptions): IConstraint<number> {
	const expected = `expected !== ${value}`;
	return numberComparator(notEqual, 's.number().notEqual()', expected, value, options);
}

export function numberInt(options?: ValidatorOptions): IConstraint<number> {
	return {
		run(input: number) {
			return Number.isInteger(input) //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError(
							's.number().int()',
							options?.message ?? 'Given value is not an integer',
							input,
							'Number.isInteger(expected) to be true'
						)
				  );
		}
	};
}

export function numberSafeInt(options?: ValidatorOptions): IConstraint<number> {
	return {
		run(input: number) {
			return Number.isSafeInteger(input) //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError(
							's.number().safeInt()',
							options?.message ?? 'Given value is not a safe integer',
							input,
							'Number.isSafeInteger(expected) to be true'
						)
				  );
		}
	};
}

export function numberFinite(options?: ValidatorOptions): IConstraint<number> {
	return {
		run(input: number) {
			return Number.isFinite(input) //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError(
							's.number().finite()',
							options?.message ?? 'Given value is not finite',
							input,
							'Number.isFinite(expected) to be true'
						)
				  );
		}
	};
}

export function numberNaN(options?: ValidatorOptions): IConstraint<number> {
	return {
		run(input: number) {
			return Number.isNaN(input) //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError('s.number().equal(NaN)', options?.message ?? 'Invalid number value', input, 'expected === NaN')
				  );
		}
	};
}

export function numberNotNaN(options?: ValidatorOptions): IConstraint<number> {
	return {
		run(input: number) {
			return Number.isNaN(input) //
				? Result.err(
						new ExpectedConstraintError('s.number().notEqual(NaN)', options?.message ?? 'Invalid number value', input, 'expected !== NaN')
				  )
				: Result.ok(input);
		}
	};
}

export function numberDivisibleBy(divider: number, options?: ValidatorOptions): IConstraint<number> {
	const expected = `expected % ${divider} === 0`;
	return {
		run(input: number) {
			return input % divider === 0 //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.number().divisibleBy()', options?.message ?? 'Number is not divisible', input, expected));
		}
	};
}
