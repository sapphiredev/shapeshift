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

		if (!this.shouldRunConstraints) {
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
