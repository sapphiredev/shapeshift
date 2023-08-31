import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import type { IConstraint } from './base/IConstraint';
import { equal, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, notEqual, type Comparator } from './util/operators';
import type { TypedArray } from './util/typedArray';

export type TypedArrayConstraintName = `s.typedArray(T).${'byteLength' | 'length'}${
	| 'LessThan'
	| 'LessThanOrEqual'
	| 'GreaterThan'
	| 'GreaterThanOrEqual'
	| 'Equal'
	| 'NotEqual'
	| 'Range'
	| 'RangeInclusive'
	| 'RangeExclusive'}()`;

function typedArrayByteLengthComparator<T extends TypedArray>(
	comparator: Comparator,
	name: TypedArrayConstraintName,
	expected: string,
	length: number,
	options?: ValidatorOptions
): IConstraint<T> {
	return {
		run(input: T) {
			return comparator(input.byteLength, length) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, options?.message ?? 'Invalid Typed Array byte length', input, expected));
		}
	};
}

export function typedArrayByteLengthLessThan<T extends TypedArray>(value: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.byteLength < ${value}`;
	return typedArrayByteLengthComparator(lessThan, 's.typedArray(T).byteLengthLessThan()', expected, value, options);
}

export function typedArrayByteLengthLessThanOrEqual<T extends TypedArray>(value: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.byteLength <= ${value}`;
	return typedArrayByteLengthComparator(lessThanOrEqual, 's.typedArray(T).byteLengthLessThanOrEqual()', expected, value, options);
}

export function typedArrayByteLengthGreaterThan<T extends TypedArray>(value: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.byteLength > ${value}`;
	return typedArrayByteLengthComparator(greaterThan, 's.typedArray(T).byteLengthGreaterThan()', expected, value, options);
}

export function typedArrayByteLengthGreaterThanOrEqual<T extends TypedArray>(value: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.byteLength >= ${value}`;
	return typedArrayByteLengthComparator(greaterThanOrEqual, 's.typedArray(T).byteLengthGreaterThanOrEqual()', expected, value, options);
}

export function typedArrayByteLengthEqual<T extends TypedArray>(value: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.byteLength === ${value}`;
	return typedArrayByteLengthComparator(equal, 's.typedArray(T).byteLengthEqual()', expected, value, options);
}

export function typedArrayByteLengthNotEqual<T extends TypedArray>(value: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.byteLength !== ${value}`;
	return typedArrayByteLengthComparator(notEqual, 's.typedArray(T).byteLengthNotEqual()', expected, value, options);
}

export function typedArrayByteLengthRange<T extends TypedArray>(start: number, endBefore: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.byteLength >= ${start} && expected.byteLength < ${endBefore}`;
	return {
		run(input: T) {
			return input.byteLength >= start && input.byteLength < endBefore //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError(
							's.typedArray(T).byteLengthRange()',
							options?.message ?? 'Invalid Typed Array byte length',
							input,
							expected
						)
				  );
		}
	};
}

export function typedArrayByteLengthRangeInclusive<T extends TypedArray>(start: number, end: number, options?: ValidatorOptions) {
	const expected = `expected.byteLength >= ${start} && expected.byteLength <= ${end}`;
	return {
		run(input: T) {
			return input.byteLength >= start && input.byteLength <= end //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError(
							's.typedArray(T).byteLengthRangeInclusive()',
							options?.message ?? 'Invalid Typed Array byte length',
							input,
							expected
						)
				  );
		}
	};
}

export function typedArrayByteLengthRangeExclusive<T extends TypedArray>(
	startAfter: number,
	endBefore: number,
	options?: ValidatorOptions
): IConstraint<T> {
	const expected = `expected.byteLength > ${startAfter} && expected.byteLength < ${endBefore}`;
	return {
		run(input: T) {
			return input.byteLength > startAfter && input.byteLength < endBefore //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError(
							's.typedArray(T).byteLengthRangeExclusive()',
							options?.message ?? 'Invalid Typed Array byte length',
							input,
							expected
						)
				  );
		}
	};
}

function typedArrayLengthComparator<T extends TypedArray>(
	comparator: Comparator,
	name: TypedArrayConstraintName,
	expected: string,
	length: number,
	options?: ValidatorOptions
): IConstraint<T> {
	return {
		run(input: T) {
			return comparator(input.length, length) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, options?.message ?? 'Invalid Typed Array length', input, expected));
		}
	};
}

export function typedArrayLengthLessThan<T extends TypedArray>(value: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.length < ${value}`;
	return typedArrayLengthComparator(lessThan, 's.typedArray(T).lengthLessThan()', expected, value, options);
}

export function typedArrayLengthLessThanOrEqual<T extends TypedArray>(value: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.length <= ${value}`;
	return typedArrayLengthComparator(lessThanOrEqual, 's.typedArray(T).lengthLessThanOrEqual()', expected, value, options);
}

export function typedArrayLengthGreaterThan<T extends TypedArray>(value: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.length > ${value}`;
	return typedArrayLengthComparator(greaterThan, 's.typedArray(T).lengthGreaterThan()', expected, value, options);
}

export function typedArrayLengthGreaterThanOrEqual<T extends TypedArray>(value: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.length >= ${value}`;
	return typedArrayLengthComparator(greaterThanOrEqual, 's.typedArray(T).lengthGreaterThanOrEqual()', expected, value, options);
}

export function typedArrayLengthEqual<T extends TypedArray>(value: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.length === ${value}`;
	return typedArrayLengthComparator(equal, 's.typedArray(T).lengthEqual()', expected, value, options);
}

export function typedArrayLengthNotEqual<T extends TypedArray>(value: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.length !== ${value}`;
	return typedArrayLengthComparator(notEqual, 's.typedArray(T).lengthNotEqual()', expected, value, options);
}

export function typedArrayLengthRange<T extends TypedArray>(start: number, endBefore: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.length >= ${start} && expected.length < ${endBefore}`;
	return {
		run(input: T) {
			return input.length >= start && input.length < endBefore //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError(
							's.typedArray(T).lengthRange()',
							options?.message ?? 'Invalid Typed Array length',
							input,
							expected
						)
				  );
		}
	};
}

export function typedArrayLengthRangeInclusive<T extends TypedArray>(start: number, end: number, options?: ValidatorOptions): IConstraint<T> {
	const expected = `expected.length >= ${start} && expected.length <= ${end}`;
	return {
		run(input: T) {
			return input.length >= start && input.length <= end //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError(
							's.typedArray(T).lengthRangeInclusive()',
							options?.message ?? 'Invalid Typed Array length',
							input,
							expected
						)
				  );
		}
	};
}

export function typedArrayLengthRangeExclusive<T extends TypedArray>(
	startAfter: number,
	endBefore: number,
	options?: ValidatorOptions
): IConstraint<T> {
	const expected = `expected.length > ${startAfter} && expected.length < ${endBefore}`;
	return {
		run(input: T) {
			return input.length > startAfter && input.length < endBefore //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError(
							's.typedArray(T).lengthRangeExclusive()',
							options?.message ?? 'Invalid Typed Array length',
							input,
							expected
						)
				  );
		}
	};
}
