import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, equal, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, notEqual } from './util/operators';

export type NumberConstraintName = `s.number.${
	| 'lessThan'
	| 'lessThanOrEqual'
	| 'greaterThan'
	| 'greaterThanOrEqual'
	| 'equal'
	| 'equal(NaN)'
	| 'notEqual'
	| 'notEqual(NaN)'
	| 'int'
	| 'safeInt'
	| 'finite'
	| 'divisibleBy'}`;

function numberComparator(comparator: Comparator, name: NumberConstraintName, expected: string, number: number): IConstraint<number> {
	return {
		run(input: number) {
			return comparator(input, number) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, 'Invalid number value', input, expected));
		}
	};
}

export function numberLessThan(value: number): IConstraint<number> {
	const expected = `expected < ${value}`;
	return numberComparator(lessThan, 's.number.lessThan', expected, value);
}

export function numberLessThanOrEqual(value: number): IConstraint<number> {
	const expected = `expected <= ${value}`;
	return numberComparator(lessThanOrEqual, 's.number.lessThanOrEqual', expected, value);
}

export function numberGreaterThan(value: number): IConstraint<number> {
	const expected = `expected > ${value}`;
	return numberComparator(greaterThan, 's.number.greaterThan', expected, value);
}

export function numberGreaterThanOrEqual(value: number): IConstraint<number> {
	const expected = `expected >= ${value}`;
	return numberComparator(greaterThanOrEqual, 's.number.greaterThanOrEqual', expected, value);
}

export function numberEqual(value: number): IConstraint<number> {
	const expected = `expected === ${value}`;
	return numberComparator(equal, 's.number.equal', expected, value);
}

export function numberNotEqual(value: number): IConstraint<number> {
	const expected = `expected !== ${value}`;
	return numberComparator(notEqual, 's.number.notEqual', expected, value);
}

export const numberInt: IConstraint<number> = {
	run(input: number) {
		return Number.isInteger(input) //
			? Result.ok(input)
			: Result.err(
					new ExpectedConstraintError('s.number.int', 'Given value is not an integer', input, 'Number.isInteger(expected) to be true')
			  );
	}
};

export const numberSafeInt: IConstraint<number> = {
	run(input: number) {
		return Number.isSafeInteger(input) //
			? Result.ok(input)
			: Result.err(
					new ExpectedConstraintError(
						's.number.safeInt',
						'Given value is not a safe integer',
						input,
						'Number.isSafeInteger(expected) to be true'
					)
			  );
	}
};

export const numberFinite: IConstraint<number> = {
	run(input: number) {
		return Number.isFinite(input) //
			? Result.ok(input)
			: Result.err(new ExpectedConstraintError('s.number.finite', 'Given value is not finite', input, 'Number.isFinite(expected) to be true'));
	}
};

export const numberNaN: IConstraint<number> = {
	run(input: number) {
		return Number.isNaN(input) //
			? Result.ok(input)
			: Result.err(new ExpectedConstraintError('s.number.equal(NaN)', 'Invalid number value', input, 'expected === NaN'));
	}
};

export const numberNotNaN: IConstraint<number> = {
	run(input: number) {
		return Number.isNaN(input) //
			? Result.err(new ExpectedConstraintError('s.number.notEqual(NaN)', 'Invalid number value', input, 'expected !== NaN'))
			: Result.ok(input);
	}
};

export function numberDivisibleBy(divider: number): IConstraint<number> {
	const expected = `expected % ${divider} === 0`;
	return {
		run(input: number) {
			return input % divider === 0 //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.number.divisibleBy', 'Number is not divisible', input, expected));
		}
	};
}
