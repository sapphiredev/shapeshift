import { isDeepStrictEqual } from 'node:util';
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
import type { ExpandSmallerTuples, Tuple, UnshiftTuple } from '../lib/util-types';
import { BaseValidator } from './imports';

export class ArrayValidator<T extends unknown[], I = T[number]> extends BaseValidator<T> {
	private readonly checkUnique: boolean;
	private readonly validator: BaseValidator<I>;

	public constructor(validator: BaseValidator<I>, checkUnique = false, constraints: readonly IConstraint<T>[] = []) {
		super(constraints);
		this.validator = validator;
		this.checkUnique = checkUnique;
	}

	public lengthLessThan<N extends number>(length: N): ArrayValidator<ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, N>]>>> {
		return this.addConstraint(arrayLengthLessThan(length) as IConstraint<T>) as any;
	}

	public lengthLessThanOrEqual<N extends number>(length: N): ArrayValidator<ExpandSmallerTuples<[...Tuple<I, N>]>> {
		return this.addConstraint(arrayLengthLessThanOrEqual(length) as IConstraint<T>) as any;
	}

	public lengthGreaterThan<N extends number>(length: N): ArrayValidator<[...Tuple<I, N>, I, ...T]> {
		return this.addConstraint(arrayLengthGreaterThan(length) as IConstraint<T>) as any;
	}

	public lengthGreaterThanOrEqual<N extends number>(length: N): ArrayValidator<[...Tuple<I, N>, ...T]> {
		return this.addConstraint(arrayLengthGreaterThanOrEqual(length) as IConstraint<T>) as any;
	}

	public lengthEqual<N extends number>(length: N): ArrayValidator<[...Tuple<I, N>]> {
		return this.addConstraint(arrayLengthEqual(length) as IConstraint<T>) as any;
	}

	public lengthNotEqual(length: number): ArrayValidator<[...T]> {
		return this.addConstraint(arrayLengthNotEqual(length) as IConstraint<T>) as any;
	}

	public lengthRange<S extends number, E extends number>(
		start: S,
		endBefore: E
	): ArrayValidator<Exclude<ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, E>]>>, ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, S>]>>>> {
		return this.addConstraint(arrayLengthRange(start, endBefore) as IConstraint<T>) as any;
	}

	public lengthRangeInclusive<S extends number, E extends number>(
		startAt: S,
		endAt: E
	): ArrayValidator<Exclude<ExpandSmallerTuples<[...Tuple<I, E>]>, ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, S>]>>>> {
		return this.addConstraint(arrayLengthRangeInclusive(startAt, endAt) as IConstraint<T>) as any;
	}

	public lengthRangeExclusive<S extends number, E extends number>(
		startAfter: S,
		endBefore: E
	): ArrayValidator<Exclude<ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, E>]>>, ExpandSmallerTuples<[...Tuple<T, S>]>>> {
		return this.addConstraint(arrayLengthRangeExclusive(startAfter, endBefore) as IConstraint<T>) as any;
	}

	public get unique(): this {
		return Reflect.construct(this.constructor, [this.validator, true, this.constraints]);
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.checkUnique, this.constraints]);
	}

	protected handle(values: unknown): Result<T, ValidationError | CombinedPropertyError> {
		if (!Array.isArray(values)) {
			return Result.err(new ValidationError('s.array(T)', 'Expected an array', values));
		}

		if (!this.shouldRunConstraints) {
			return Result.ok(values as T);
		}

		if (this.checkUnique && !this.isUnique(values)) {
			return Result.err(new ValidationError('s.array(T).unique', 'Expected all values to be unique', values));
		}

		const errors: [number, BaseError][] = [];
		const transformed: T = [] as unknown as T;

		for (let i = 0; i < values.length; i++) {
			const result = this.validator.run(values[i]);
			if (result.isOk()) transformed.push(result.value);
			else errors.push([i, result.error!]);
		}

		return errors.length === 0 //
			? Result.ok(transformed)
			: Result.err(new CombinedPropertyError(errors));
	}

	private isUnique(givenValues: unknown[]) {
		if (givenValues.length < 2) return true;

		for (let index = 1; index <= givenValues.length; index++) {
			const previousValue = givenValues[index - 1];
			if (isDeepStrictEqual(previousValue, givenValues[index])) return false;
		}

		return true;
	}
}
