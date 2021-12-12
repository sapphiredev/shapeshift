import type { IConstraint } from '../constraints/base/IConstraint';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator } from './BaseValidator';

export class ObjectValidator<T extends NonNullObject> extends BaseValidator<T> {
	public readonly shape: MappedObjectValidator<T>;
	private readonly keys: readonly (keyof T)[];
	private readonly strategy: ObjectValidatorStrategy;
	private readonly handleStrategy: (value: NonNullObject) => Result<T, ValidationError>;

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
				this.handleStrategy = this.handleIgnoreStrategy.bind(this);
				break;
			case ObjectValidatorStrategy.Strict: {
				this.handleStrategy = this.handleStrictStrategy.bind(this);
				break;
			}
		}
	}

	protected handle(value: unknown): Result<T, ValidationError> {
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

	private handleIgnoreStrategy(value: NonNullObject): Result<T, ValidationError> {}

	private handleStrictStrategy(value: NonNullObject): Result<T, ValidationError> {}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type NonNullObject = {} & object;
export type MappedObjectValidator<T> = { [key in keyof T]: BaseValidator<T[key]> };

export const enum ObjectValidatorStrategy {
	Ignore,
	Strict
}
