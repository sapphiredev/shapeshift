import type { IConstraint } from '../constraints/base/IConstraint';
import {
	stringDate,
	stringEmail,
	stringIp,
	stringLengthEqual,
	stringLengthGreaterThan,
	stringLengthGreaterThanOrEqual,
	stringLengthLessThan,
	stringLengthLessThanOrEqual,
	stringLengthNotEqual,
	stringPhone,
	stringRegex,
	stringUrl,
	stringUuid,
	type StringUuidOptions,
	type UrlOptions
} from '../constraints/StringConstraints';
import { ValidationError } from '../lib/errors/ValidationError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import { BaseValidator } from './imports';

export class StringValidator<T extends string> extends BaseValidator<T> {
	public lengthLessThan(length: number, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(stringLengthLessThan(length, options) as IConstraint<T>);
	}

	public lengthLessThanOrEqual(length: number, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(stringLengthLessThanOrEqual(length, options) as IConstraint<T>);
	}

	public lengthGreaterThan(length: number, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(stringLengthGreaterThan(length, options) as IConstraint<T>);
	}

	public lengthGreaterThanOrEqual(length: number, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(stringLengthGreaterThanOrEqual(length, options) as IConstraint<T>);
	}

	public lengthEqual(length: number, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(stringLengthEqual(length, options) as IConstraint<T>);
	}

	public lengthNotEqual(length: number, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(stringLengthNotEqual(length, options) as IConstraint<T>);
	}

	public email(options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(stringEmail(options) as IConstraint<T>);
	}

	public url(validatorOptions?: ValidatorOptions): this;
	public url(options?: UrlOptions, validatorOptions?: ValidatorOptions): this;
	public url(options?: UrlOptions | ValidatorOptions, validatorOptions: ValidatorOptions = this.validatorOptions): this {
		const urlOptions = (options as ValidatorOptions)?.message === undefined;

		if (urlOptions) {
			return this.addConstraint(stringUrl(options as UrlOptions, validatorOptions) as IConstraint<T>);
		}

		return this.addConstraint(stringUrl(undefined, validatorOptions) as IConstraint<T>);
	}

	public uuid(validatorOptions?: ValidatorOptions): this;
	public uuid(options?: StringUuidOptions, validatorOptions?: ValidatorOptions): this;
	public uuid(options?: StringUuidOptions | ValidatorOptions, validatorOptions: ValidatorOptions = this.validatorOptions): this {
		const stringUuidOptions = (options as ValidatorOptions)?.message === undefined;

		if (stringUuidOptions) {
			return this.addConstraint(stringUuid(options as StringUuidOptions, validatorOptions) as IConstraint<T>);
		}

		return this.addConstraint(stringUuid(undefined, validatorOptions) as IConstraint<T>);
	}

	public regex(regex: RegExp, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(stringRegex(regex, options) as IConstraint<T>);
	}

	public date(options: ValidatorOptions = this.validatorOptions) {
		return this.addConstraint(stringDate(options) as IConstraint<T>);
	}

	public ipv4(options: ValidatorOptions = this.validatorOptions): this {
		return this.ip(4, options);
	}

	public ipv6(options: ValidatorOptions = this.validatorOptions): this {
		return this.ip(6, options);
	}

	public ip(version?: 4 | 6, options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(stringIp(version, options) as IConstraint<T>);
	}

	public phone(options: ValidatorOptions = this.validatorOptions): this {
		return this.addConstraint(stringPhone(options) as IConstraint<T>);
	}

	protected handle(value: unknown): Result<T, ValidationError> {
		return typeof value === 'string' //
			? Result.ok(value as T)
			: Result.err(new ValidationError('s.string()', this.validatorOptions.message ?? 'Expected a string primitive', value));
	}
}
