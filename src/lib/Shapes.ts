import { ArrayValidator } from '../validators/ArrayValidator';
import type { BaseValidator } from '../validators/BaseValidator';
import { BigIntValidator } from '../validators/BigIntValidator';
import { BooleanValidator } from '../validators/BooleanValidator';
import { DateValidator } from '../validators/DateValidator';
import { Constructor, InstanceValidator } from '../validators/InstanceValidator';
import { LiteralValidator } from '../validators/LiteralValidator';
import { NeverValidator } from '../validators/NeverValidator';
import { NullishValidator } from '../validators/NullishValidator';
import { NumberValidator } from '../validators/NumberValidator';
import { PassthroughValidator } from '../validators/PassthroughValidator';
import { SetValidator } from '../validators/SetValidator';
import { StringValidator } from '../validators/StringValidator';
import { UnionValidator } from '../validators/UnionValidator';

export class Shapes {
	public get string() {
		return new StringValidator();
	}

	public get number() {
		return new NumberValidator();
	}

	public get bigint() {
		return new BigIntValidator();
	}

	public get boolean() {
		return new BooleanValidator();
	}

	public get date() {
		return new DateValidator();
	}

	public get undefined() {
		return this.literal(undefined);
	}

	public get null() {
		return this.literal(null);
	}

	public get nullish() {
		return new NullishValidator();
	}

	public get any() {
		return new PassthroughValidator<any>();
	}

	public get unknown() {
		return new PassthroughValidator<unknown>();
	}

	public get never() {
		return new NeverValidator();
	}

	public enum<T>(...values: readonly T[]) {
		return this.union(...values.map((value) => this.literal(value)));
	}

	public literal<T>(value: T): BaseValidator<T> {
		if (value instanceof Date) return this.date.eq(value) as unknown as BaseValidator<T>;
		return new LiteralValidator(value);
	}

	public instance<T>(expected: Constructor<T>): InstanceValidator<T> {
		return new InstanceValidator(expected);
	}

	public union<T>(...validators: readonly BaseValidator<T>[]) {
		return new UnionValidator(validators);
	}

	public array<T>(validator: BaseValidator<T>) {
		return new ArrayValidator(validator);
	}

	public set<T>(validator: BaseValidator<T>) {
		return new SetValidator(validator);
	}
}
