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
import { BaseValidator } from './imports';

export class StringValidator<T extends string> extends BaseValidator<T> {
	public lengthLessThan(length: number): this {
		return this.addConstraint(stringLengthLessThan(length) as IConstraint<T>);
	}

	public lengthLessThanOrEqual(length: number): this {
		return this.addConstraint(stringLengthLessThanOrEqual(length) as IConstraint<T>);
	}

	public lengthGreaterThan(length: number): this {
		return this.addConstraint(stringLengthGreaterThan(length) as IConstraint<T>);
	}

	public lengthGreaterThanOrEqual(length: number): this {
		return this.addConstraint(stringLengthGreaterThanOrEqual(length) as IConstraint<T>);
	}

	public lengthEqual(length: number): this {
		return this.addConstraint(stringLengthEqual(length) as IConstraint<T>);
	}

	public lengthNotEqual(length: number): this {
		return this.addConstraint(stringLengthNotEqual(length) as IConstraint<T>);
	}

	public get email(): this {
		return this.addConstraint(stringEmail() as IConstraint<T>);
	}

	public url(options?: UrlOptions): this {
		return this.addConstraint(stringUrl(options) as IConstraint<T>);
	}

	public uuid(options?: StringUuidOptions): this {
		return this.addConstraint(stringUuid(options) as IConstraint<T>);
	}

	public regex(regex: RegExp): this {
		return this.addConstraint(stringRegex(regex) as IConstraint<T>);
	}

	public get date() {
		return this.addConstraint(stringDate() as IConstraint<T>);
	}

	public get ipv4(): this {
		return this.ip(4);
	}

	public get ipv6(): this {
		return this.ip(6);
	}

	public ip(version?: 4 | 6): this {
		return this.addConstraint(stringIp(version) as IConstraint<T>);
	}

	public phone(): this {
		return this.addConstraint(stringPhone() as IConstraint<T>);
	}

	protected handle(value: unknown): Result<T, ValidationError> {
		return typeof value === 'string' //
			? Result.ok(value as T)
			: Result.err(new ValidationError('s.string', 'Expected a string primitive', value));
	}
}
