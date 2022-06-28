import type { IConstraint } from '../constraints/base/IConstraint';
import type { BaseError } from '../lib/errors/BaseError';
import { CombinedError } from '../lib/errors/CombinedError';
import type { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import { BaseValidator, LiteralValidator, NullishValidator } from './imports';

export class UnionValidator<T> extends BaseValidator<T> {
	private validators: readonly BaseValidator<T>[];

	public constructor(validators: readonly BaseValidator<T>[], constraints: readonly IConstraint<T>[] = []) {
		super(constraints);
		this.validators = validators;
	}

	public override get optional(): UnionValidator<T | undefined> {
		if (this.validators.length === 0) return new UnionValidator<T | undefined>([new LiteralValidator(undefined)], this.constraints);

		const [validator] = this.validators;
		if (validator instanceof LiteralValidator) {
			// If already optional, return a clone:
			if (validator.expected === undefined) return this.clone();

			// If it's nullable, convert the nullable validator into a nullish validator to optimize `null | undefined`:
			if (validator.expected === null) {
				return new UnionValidator<T | null | undefined>(
					[new NullishValidator(), ...this.validators.slice(1)],
					this.constraints
				) as UnionValidator<T | undefined>;
			}
		} else if (validator instanceof NullishValidator) {
			// If it's already nullish (which validates optional), return a clone:
			return this.clone();
		}

		return new UnionValidator([new LiteralValidator(undefined), ...this.validators]);
	}

	public get required(): UnionValidator<Exclude<T, undefined>> {
		type RequiredValidator = UnionValidator<Exclude<T, undefined>>;

		if (this.validators.length === 0) return this.clone() as unknown as RequiredValidator;

		const [validator] = this.validators;
		if (validator instanceof LiteralValidator) {
			if (validator.expected === undefined) return new UnionValidator([...this.validators.slice(1)], this.constraints) as RequiredValidator;
		} else if (validator instanceof NullishValidator) {
			return new UnionValidator([new LiteralValidator(null), ...this.validators.slice(1)], this.constraints) as RequiredValidator;
		}

		return this.clone() as unknown as RequiredValidator;
	}

	public override get nullable(): UnionValidator<T | null> {
		if (this.validators.length === 0) return new UnionValidator<T | null>([new LiteralValidator(null)], this.constraints);

		const [validator] = this.validators;
		if (validator instanceof LiteralValidator) {
			// If already nullable, return a clone:
			if (validator.expected === null) return this.clone();

			// If it's optional, convert the optional validator into a nullish validator to optimize `null | undefined`:
			if (validator.expected === undefined) {
				return new UnionValidator<T | null | undefined>(
					[new NullishValidator(), ...this.validators.slice(1)],
					this.constraints
				) as UnionValidator<T | null>;
			}
		} else if (validator instanceof NullishValidator) {
			// If it's already nullish (which validates nullable), return a clone:
			return this.clone();
		}

		return new UnionValidator([new LiteralValidator(null), ...this.validators]);
	}

	public override get nullish(): UnionValidator<T | null | undefined> {
		if (this.validators.length === 0) return new UnionValidator<T | null | undefined>([new NullishValidator()], this.constraints);

		const [validator] = this.validators;
		if (validator instanceof LiteralValidator) {
			// If already nullable or optional, promote the union to nullish:
			if (validator.expected === null || validator.expected === undefined) {
				return new UnionValidator<T | null | undefined>([new NullishValidator(), ...this.validators.slice(1)], this.constraints);
			}
		} else if (validator instanceof NullishValidator) {
			// If it's already nullish, return a clone:
			return this.clone();
		}

		return new UnionValidator<T | null | undefined>([new NullishValidator(), ...this.validators]);
	}

	public override or<O>(...predicates: readonly BaseValidator<O>[]): UnionValidator<T | O> {
		return new UnionValidator<T | O>([...this.validators, ...predicates]);
	}

	protected override clone(): this {
		return Reflect.construct(this.constructor, [this.validators, this.constraints]);
	}

	protected handle(value: unknown): Result<T, ValidationError | CombinedError> {
		const errors: BaseError[] = [];

		for (const validator of this.validators) {
			const result = validator.run(value);
			if (result.isOk()) return result as Result<T, CombinedError>;
			errors.push(result.error!);
		}

		return Result.err(new CombinedError(errors));
	}
}
