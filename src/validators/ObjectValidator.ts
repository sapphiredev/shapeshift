import type { IConstraint } from '../constraints/base/IConstraint';
import { UnknownPropertyError } from '../lib/errors/UnknownPropertyError';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './BaseValidator';

export class ObjectValidator<T extends NonNullObject> extends BaseValidator<T> {
	public readonly shape: MappedObjectValidator<T>;
	private readonly keys: readonly (keyof T)[];
	private readonly strategy: ObjectValidatorStrategy;
	private readonly handleStrategy: (value: NonNullObject) => Result<T, AggregateError>;

	public constructor(
		shape: MappedObjectValidator<T>,
		strategy: ObjectValidatorStrategy = ObjectValidatorStrategy.Ignore,
		constraints: readonly IConstraint<T>[] = []
	) {
		super(constraints);
		this.shape = shape;
		this.keys = Object.keys(shape) as (keyof T)[];
		this.strategy = strategy;

		switch (this.strategy) {
			case ObjectValidatorStrategy.Ignore:
				this.handleStrategy = (value) => this.handleIgnoreStrategy(value);
				break;
			case ObjectValidatorStrategy.Strict: {
				this.handleStrategy = (value) => this.handleStrictStrategy(value);
				break;
			}
		}
	}

	protected override handle(value: unknown): Result<T, ValidationError | AggregateError> {
		if (typeof value !== 'object') {
			return Result.err(new ValidationError('ObjectValidator', 'Expected an object', value));
		}

		if (value === null) {
			return Result.err(new ValidationError('ObjectValidator', 'Expected object to not be null', value));
		}

		return this.handleStrategy(value);
	}

	protected clone(): this {
		return Reflect.construct(this.constructor, [this.shape, this.strategy, this.constraints]);
	}

	private handleIgnoreStrategy(value: NonNullObject, errors: Error[] = []): Result<T, AggregateError> {
		const entries = {} as T;
		let i = this.keys.length;

		while (i--) {
			const key = this.keys[i];
			const result = this.shape[key].run(value[key as keyof NonNullObject]);

			if (result.isOk()) entries[key] = result.value;
			else errors.push(result.error!);
		}

		return errors.length === 0 //
			? Result.ok(entries)
			: Result.err(new AggregateError(errors, 'Failed to match at least one of the properties'));
	}

	private handleStrictStrategy(value: NonNullObject): Result<T, AggregateError> {
		const errors: Error[] = [];

		for (const key of Object.keys(value)) {
			if (Object.prototype.hasOwnProperty.call(this.shape, key)) continue;
			errors.push(new UnknownPropertyError(key, Reflect.get(value, key)));
		}

		return errors.length === 0 //
			? this.handleIgnoreStrategy(value, errors)
			: this.handleStrictStrategyCollectErrors(value, errors);
	}

	private handleStrictStrategyCollectErrors(value: NonNullObject, errors: Error[]): Result<T, AggregateError> {
		for (const key of this.keys) {
			const result = this.shape[key].run(value[key as keyof NonNullObject]);
			if (result.isErr()) errors.push(result.error!);
		}

		return Result.err(new AggregateError(errors, 'Failed to match at least one of the properties'));
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type NonNullObject = {} & object;
export type MappedObjectValidator<T> = { [key in keyof T]: BaseValidator<T[key]> };

export const enum ObjectValidatorStrategy {
	Ignore,
	Strict
}
