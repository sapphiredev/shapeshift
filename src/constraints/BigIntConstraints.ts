import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import type { IConstraint } from './base/IConstraint';
import { equal, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, notEqual, type Comparator } from './util/operators';

export type BigIntConstraintName = `s.bigint().${
	| 'lessThan'
	| 'lessThanOrEqual'
	| 'greaterThan'
	| 'greaterThanOrEqual'
	| 'equal'
	| 'notEqual'
	| 'divisibleBy'}()`;

function bigintComparator(
	comparator: Comparator,
	name: BigIntConstraintName,
	expected: string,
	number: bigint,
	options?: ValidatorOptions
): IConstraint<bigint> {
	return {
		run(input: bigint) {
			return comparator(input, number) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, options?.message ?? 'Invalid bigint value', input, expected));
		}
	};
}

export function bigintLessThan(value: bigint, options?: ValidatorOptions): IConstraint<bigint> {
	const expected = `expected < ${value}n`;
	return bigintComparator(lessThan, 's.bigint().lessThan()', expected, value, options);
}

export function bigintLessThanOrEqual(value: bigint, options?: ValidatorOptions): IConstraint<bigint> {
	const expected = `expected <= ${value}n`;
	return bigintComparator(lessThanOrEqual, 's.bigint().lessThanOrEqual()', expected, value, options);
}

export function bigintGreaterThan(value: bigint, options?: ValidatorOptions): IConstraint<bigint> {
	const expected = `expected > ${value}n`;
	return bigintComparator(greaterThan, 's.bigint().greaterThan()', expected, value, options);
}

export function bigintGreaterThanOrEqual(value: bigint, options?: ValidatorOptions): IConstraint<bigint> {
	const expected = `expected >= ${value}n`;
	return bigintComparator(greaterThanOrEqual, 's.bigint().greaterThanOrEqual()', expected, value, options);
}

export function bigintEqual(value: bigint, options?: ValidatorOptions): IConstraint<bigint> {
	const expected = `expected === ${value}n`;
	return bigintComparator(equal, 's.bigint().equal()', expected, value, options);
}

export function bigintNotEqual(value: bigint, options?: ValidatorOptions): IConstraint<bigint> {
	const expected = `expected !== ${value}n`;
	return bigintComparator(notEqual, 's.bigint().notEqual()', expected, value, options);
}

export function bigintDivisibleBy(divider: bigint, options?: ValidatorOptions): IConstraint<bigint> {
	const expected = `expected % ${divider}n === 0n`;
	return {
		run(input: bigint) {
			return input % divider === 0n //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.bigint().divisibleBy()', options?.message ?? 'BigInt is not divisible', input, expected));
		}
	};
}
