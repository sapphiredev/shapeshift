import {
	arrayLengthEqual,
	arrayLengthGreaterThan,
	arrayLengthGreaterThanOrEqual,
	arrayLengthLessThan,
	arrayLengthLessThanOrEqual,
	arrayLengthNotEqual,
	arrayLengthRange,
	arrayLengthRangeExclusive,
	arrayLengthRangeInclusive
} from '../constraints/ArrayLengthConstraints';
import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedPropertyError } from '../lib/errors/CombinedPropertyError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './imports';

export class ArrayValidator<T> extends BaseValidator<T[]> {
	private readonly validator: BaseValidator<T>;

	public constructor(validator: BaseValidator<T>, constraints: readonly IConstraint<T[]>[] = []) {
		super(constraints);
		this.validator = validator;
	}

	public lengthLessThan<N extends number>(length: N): BaseValidator<ExpandSmallerTuples<UnshiftTuple<[...Tuple<T, N>]>>> {
		return this.addConstraint(arrayLengthLessThan(length) as IConstraint<T[]>) as any;
	}

	public lengthLessThanOrEqual<N extends number>(length: N): BaseValidator<ExpandSmallerTuples<[...Tuple<T, N>]>> {
		return this.addConstraint(arrayLengthLessThanOrEqual(length)) as any;
	}

	public lengthGreaterThan<N extends number>(length: N): BaseValidator<[...Tuple<T, N>, T, ...T[]]> {
		return this.addConstraint(arrayLengthGreaterThan(length)) as any;
	}

	public lengthGreaterThanOrEqual<N extends number>(length: N): BaseValidator<[...Tuple<T, N>, ...T[]]> {
		return this.addConstraint(arrayLengthGreaterThanOrEqual(length)) as any;
	}

	public lengthEqual<N extends number>(length: N): BaseValidator<[...Tuple<T, N>]> {
		return this.addConstraint(arrayLengthEqual(length)) as any;
	}

	public lengthNotEqual(length: number): BaseValidator<[...T[]]> {
		return this.addConstraint(arrayLengthNotEqual(length)) as any;
	}

	public lengthRange<S extends number, E extends number>(
		start: S,
		endBefore: E
	): BaseValidator<Exclude<ExpandSmallerTuples<UnshiftTuple<[...Tuple<T, E>]>>, ExpandSmallerTuples<UnshiftTuple<[...Tuple<T, S>]>>>> {
		return this.addConstraint(arrayLengthRange(start, endBefore)) as any;
	}

	public lengthRangeInclusive<S extends number, E extends number>(
		startAt: S,
		endAt: E
	): BaseValidator<Exclude<ExpandSmallerTuples<[...Tuple<T, E>]>, ExpandSmallerTuples<UnshiftTuple<[...Tuple<T, S>]>>>> {
		return this.addConstraint(arrayLengthRangeInclusive(startAt, endAt)) as any;
	}

	public lengthRangeExclusive<S extends number, E extends number>(
		startAfter: S,
		endBefore: E
	): BaseValidator<Exclude<ExpandSmallerTuples<UnshiftTuple<[...Tuple<T, E>]>>, ExpandSmallerTuples<[...Tuple<T, S>]>>> {
		return this.addConstraint(arrayLengthRangeExclusive(startAfter, endBefore)) as any;
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.constraints]);
	}

	protected handle(values: unknown): Result<T[], ValidationError | CombinedPropertyError> {
		if (!Array.isArray(values)) {
			return Result.err(new ValidationError('s.array(T)', 'Expected an array', values));
		}

		if (!this.shouldValidatorRunConstraints) {
			return Result.ok(values);
		}

		const errors: [number, BaseError][] = [];
		const transformed: T[] = [];

		for (let i = 0; i < values.length; i++) {
			const result = this.validator.run(values[i]);
			if (result.isOk()) transformed.push(result.value);
			else errors.push([i, result.error!]);
		}

		return errors.length === 0 //
			? Result.ok(transformed)
			: Result.err(new CombinedPropertyError(errors));
	}
}

export type UnshiftTuple<T extends [...any[]]> = T extends [T[0], ...infer Tail] ? Tail : never;
export type ExpandSmallerTuples<T extends [...any[]]> = T extends [T[0], ...infer Tail] ? T | ExpandSmallerTuples<Tail> : [];

// https://github.com/microsoft/TypeScript/issues/26223#issuecomment-755067958
export type Shift<A extends Array<any>> = ((...args: A) => void) extends (...args: [A[0], ...infer R]) => void ? R : never;

export type GrowExpRev<A extends Array<any>, N extends number, P extends Array<Array<any>>> = A['length'] extends N
	? A
	: GrowExpRev<[...A, ...P[0]][N] extends undefined ? [...A, ...P[0]] : A, N, Shift<P>>;

export type GrowExp<A extends Array<any>, N extends number, P extends Array<Array<any>>> = [...A, ...A][N] extends undefined
	? GrowExp<[...A, ...A], N, [A, ...P]>
	: GrowExpRev<A, N, P>;

export type Tuple<T, N extends number> = number extends N ? Array<T> : N extends 0 ? [] : N extends 1 ? [T] : GrowExp<[T], N, [[]]>;
