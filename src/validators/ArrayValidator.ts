import {
	arrayLengthEqual,
	arrayLengthGreaterThan,
	arrayLengthGreaterThanOrEqual,
	arrayLengthLessThan,
	arrayLengthLessThanOrEqual,
	arrayLengthNotEqual,
	arrayLengthRange,
	arrayLengthRangeExclusive,
	arrayLengthRangeInclusive,
	uniqueArray
} from '../constraints/ArrayConstraints';
import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedPropertyError } from '../lib/errors/CombinedPropertyError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { ExpandSmallerTuples, Tuple, UnshiftTuple } from '../lib/util-types';
import { BaseValidator } from './imports';

type makeArray<T> = T extends any[] ? T : T[];

export class ArrayValidator<T, I = makeArray<T>[number], P extends unknown[] = makeArray<T>> extends BaseValidator<P> {
	private readonly validator: BaseValidator<I>;

	public constructor(validator: BaseValidator<I>, constraints: readonly IConstraint<P>[] = []) {
		super(constraints);
		this.validator = validator;
	}

	public lengthLessThan<N extends number>(length: N): ArrayValidator<ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, N>]>>> {
		return this.addConstraint(arrayLengthLessThan(length) as IConstraint<P>) as any;
	}

	public lengthLessThanOrEqual<N extends number>(length: N): ArrayValidator<ExpandSmallerTuples<[...Tuple<I, N>]>> {
		return this.addConstraint(arrayLengthLessThanOrEqual(length) as IConstraint<P>) as any;
	}

	public lengthGreaterThan<N extends number>(length: N): ArrayValidator<[...Tuple<I, N>, I, ...P]> {
		return this.addConstraint(arrayLengthGreaterThan(length) as IConstraint<P>) as any;
	}

	public lengthGreaterThanOrEqual<N extends number>(length: N): ArrayValidator<[...Tuple<I, N>, ...P]> {
		return this.addConstraint(arrayLengthGreaterThanOrEqual(length) as IConstraint<P>) as any;
	}

	public lengthEqual<N extends number>(length: N): ArrayValidator<[...Tuple<I, N>]> {
		return this.addConstraint(arrayLengthEqual(length) as IConstraint<P>) as any;
	}

	public lengthNotEqual(length: number): ArrayValidator<[...P]> {
		return this.addConstraint(arrayLengthNotEqual(length) as IConstraint<P>) as any;
	}

	public lengthRange<S extends number, E extends number>(
		start: S,
		endBefore: E
	): ArrayValidator<Exclude<ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, E>]>>, ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, S>]>>>> {
		return this.addConstraint(arrayLengthRange(start, endBefore) as IConstraint<P>) as any;
	}

	public lengthRangeInclusive<S extends number, E extends number>(
		startAt: S,
		endAt: E
	): ArrayValidator<Exclude<ExpandSmallerTuples<[...Tuple<I, E>]>, ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, S>]>>>> {
		return this.addConstraint(arrayLengthRangeInclusive(startAt, endAt) as IConstraint<P>) as any;
	}

	public lengthRangeExclusive<S extends number, E extends number>(
		startAfter: S,
		endBefore: E
	): ArrayValidator<Exclude<ExpandSmallerTuples<UnshiftTuple<[...Tuple<I, E>]>>, ExpandSmallerTuples<[...Tuple<T, S>]>>> {
		return this.addConstraint(arrayLengthRangeExclusive(startAfter, endBefore) as IConstraint<P>) as any;
	}

	public get unique(): this {
		return this.addConstraint(uniqueArray as IConstraint<P>);
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validator, this.constraints]);
	}

	protected handle(values: unknown): Result<P, ValidationError | CombinedPropertyError> {
		if (!Array.isArray(values)) {
			return Result.err(new ValidationError('s.array(T)', 'Expected an array', values));
		}

		if (!this.shouldRunConstraints) {
			return Result.ok(values as P);
		}

		const errors: [number, BaseError][] = [];
		const transformed: P = [] as unknown as P;

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
