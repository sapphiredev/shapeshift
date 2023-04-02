import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
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
	| 'RangeExclusive'}`;

function typedArrayByteLengthComparator<T extends TypedArray>(
	comparator: Comparator,
	name: TypedArrayConstraintName,
	expected: string,
	length: number
): IConstraint<T> {
	return {
		run(input: T) {
			return comparator(input.byteLength, length) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, 'Invalid Typed Array byte length', input, expected));
		}
	};
}

export function typedArrayByteLengthLessThan<T extends TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.byteLength < ${value}`;
	return typedArrayByteLengthComparator(lessThan, 's.typedArray(T).byteLengthLessThan', expected, value);
}

export function typedArrayByteLengthLessThanOrEqual<T extends TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.byteLength <= ${value}`;
	return typedArrayByteLengthComparator(lessThanOrEqual, 's.typedArray(T).byteLengthLessThanOrEqual', expected, value);
}

export function typedArrayByteLengthGreaterThan<T extends TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.byteLength > ${value}`;
	return typedArrayByteLengthComparator(greaterThan, 's.typedArray(T).byteLengthGreaterThan', expected, value);
}

export function typedArrayByteLengthGreaterThanOrEqual<T extends TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.byteLength >= ${value}`;
	return typedArrayByteLengthComparator(greaterThanOrEqual, 's.typedArray(T).byteLengthGreaterThanOrEqual', expected, value);
}

export function typedArrayByteLengthEqual<T extends TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.byteLength === ${value}`;
	return typedArrayByteLengthComparator(equal, 's.typedArray(T).byteLengthEqual', expected, value);
}

export function typedArrayByteLengthNotEqual<T extends TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.byteLength !== ${value}`;
	return typedArrayByteLengthComparator(notEqual, 's.typedArray(T).byteLengthNotEqual', expected, value);
}

export function typedArrayByteLengthRange<T extends TypedArray>(start: number, endBefore: number): IConstraint<T> {
	const expected = `expected.byteLength >= ${start} && expected.byteLength < ${endBefore}`;
	return {
		run(input: T) {
			return input.byteLength >= start && input.byteLength < endBefore //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.typedArray(T).byteLengthRange', 'Invalid Typed Array byte length', input, expected));
		}
	};
}

export function typedArrayByteLengthRangeInclusive<T extends TypedArray>(start: number, end: number) {
	const expected = `expected.byteLength >= ${start} && expected.byteLength <= ${end}`;
	return {
		run(input: T) {
			return input.byteLength >= start && input.byteLength <= end //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError('s.typedArray(T).byteLengthRangeInclusive', 'Invalid Typed Array byte length', input, expected)
				  );
		}
	};
}

export function typedArrayByteLengthRangeExclusive<T extends TypedArray>(startAfter: number, endBefore: number): IConstraint<T> {
	const expected = `expected.byteLength > ${startAfter} && expected.byteLength < ${endBefore}`;
	return {
		run(input: T) {
			return input.byteLength > startAfter && input.byteLength < endBefore //
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError('s.typedArray(T).byteLengthRangeExclusive', 'Invalid Typed Array byte length', input, expected)
				  );
		}
	};
}

function typedArrayLengthComparator<T extends TypedArray>(
	comparator: Comparator,
	name: TypedArrayConstraintName,
	expected: string,
	length: number
): IConstraint<T> {
	return {
		run(input: T) {
			return comparator(input.length, length) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, 'Invalid Typed Array length', input, expected));
		}
	};
}

export function typedArrayLengthLessThan<T extends TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.length < ${value}`;
	return typedArrayLengthComparator(lessThan, 's.typedArray(T).lengthLessThan', expected, value);
}

export function typedArrayLengthLessThanOrEqual<T extends TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.length <= ${value}`;
	return typedArrayLengthComparator(lessThanOrEqual, 's.typedArray(T).lengthLessThanOrEqual', expected, value);
}

export function typedArrayLengthGreaterThan<T extends TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.length > ${value}`;
	return typedArrayLengthComparator(greaterThan, 's.typedArray(T).lengthGreaterThan', expected, value);
}

export function typedArrayLengthGreaterThanOrEqual<T extends TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.length >= ${value}`;
	return typedArrayLengthComparator(greaterThanOrEqual, 's.typedArray(T).lengthGreaterThanOrEqual', expected, value);
}

export function typedArrayLengthEqual<T extends TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.length === ${value}`;
	return typedArrayLengthComparator(equal, 's.typedArray(T).lengthEqual', expected, value);
}

export function typedArrayLengthNotEqual<T extends TypedArray>(value: number): IConstraint<T> {
	const expected = `expected.length !== ${value}`;
	return typedArrayLengthComparator(notEqual, 's.typedArray(T).lengthNotEqual', expected, value);
}

export function typedArrayLengthRange<T extends TypedArray>(start: number, endBefore: number): IConstraint<T> {
	const expected = `expected.length >= ${start} && expected.length < ${endBefore}`;
	return {
		run(input: T) {
			return input.length >= start && input.length < endBefore //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.typedArray(T).lengthRange', 'Invalid Typed Array length', input, expected));
		}
	};
}

export function typedArrayLengthRangeInclusive<T extends TypedArray>(start: number, end: number): IConstraint<T> {
	const expected = `expected.length >= ${start} && expected.length <= ${end}`;
	return {
		run(input: T) {
			return input.length >= start && input.length <= end //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.typedArray(T).lengthRangeInclusive', 'Invalid Typed Array length', input, expected));
		}
	};
}

export function typedArrayLengthRangeExclusive<T extends TypedArray>(startAfter: number, endBefore: number): IConstraint<T> {
	const expected = `expected.length > ${startAfter} && expected.length < ${endBefore}`;
	return {
		run(input: T) {
			return input.length > startAfter && input.length < endBefore //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.typedArray(T).lengthRangeExclusive', 'Invalid Typed Array length', input, expected));
		}
	};
}
