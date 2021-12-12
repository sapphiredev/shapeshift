import type { IConstraint } from '../constraints/base/IConstraint';
import type { ValidationError } from '../lib/errors/ValidationError';
import type { Result } from '../lib/Result';

export abstract class BaseValidator<T> {
	protected constraints: readonly IConstraint<T>[] = [];

	public constructor(constraints: readonly IConstraint<T>[] = []) {
		this.constraints = constraints;
	}

	public get optional(): UnionValidator<T | undefined> {
		return new UnionValidator([new LiteralValidator(undefined), this.clone()]);
	}

	public get nullable(): UnionValidator<T | null> {
		return new UnionValidator([new LiteralValidator(null), this.clone()]);
	}

	public get nullish(): UnionValidator<T | null | undefined> {
		return new UnionValidator([new NullishValidator(), this.clone()]);
	}

	public get array(): ArrayValidator<T> {
		return new ArrayValidator<T>(this.clone());
	}

	public get set(): SetValidator<T> {
		return new SetValidator<T>(this.clone());
	}

	public or<O>(...predicates: readonly BaseValidator<O>[]): UnionValidator<T | O> {
		return new UnionValidator<T | O>([this.clone(), ...predicates]);
	}

	public run(value: unknown): Result<T, Error> {
		let result = this.handle(value) as Result<T>;
		if (result.isErr()) return result;

		for (const constraint of this.constraints) {
			result = constraint.run(result.value as T);
			if (result.isErr()) break;
		}

		return result;
	}

	public parse(value: unknown): T {
		return this.constraints.reduce((v, constraint) => constraint.run(v).unwrap(), this.handle(value).unwrap());
	}

	protected clone(): this {
		return Reflect.construct(this.constructor, [this.constraints]);
	}

	protected abstract handle(value: unknown): Result<T, ValidationError>;

	protected addConstraint(constraint: IConstraint<T>): this {
		const clone = this.clone();
		clone.constraints = clone.constraints.concat(constraint);
		return clone;
	}
}

import { ArrayValidator } from './ArrayValidator';
import { LiteralValidator } from './LiteralValidator';
import { NullishValidator } from './NullishValidator';
import { SetValidator } from './SetValidator';
import { UnionValidator } from './UnionValidator';
