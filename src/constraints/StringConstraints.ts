import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import type { IConstraint } from './base/IConstraint';
import { validateEmail } from './util/emailValidator';
import { isIP, isIPv4, isIPv6 } from './util/net';
import { equal, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, notEqual, type Comparator } from './util/operators';
import { validatePhoneNumber } from './util/phoneValidator';
import { createUrlValidators } from './util/urlValidators';

export type StringConstraintName = `s.string().${
	| `length${'LessThan' | 'LessThanOrEqual' | 'GreaterThan' | 'GreaterThanOrEqual' | 'Equal' | 'NotEqual'}`
	| 'regex'
	| 'url'
	| 'uuid'
	| 'email'
	| `ip${'v4' | 'v6' | ''}`
	| 'date'
	| 'phone'}()`;

export type StringProtocol = `${string}:`;

export type StringDomain = `${string}.${string}`;

export interface UrlOptions {
	allowedProtocols?: StringProtocol[];
	allowedDomains?: StringDomain[];
}

export type UUIDVersion = 1 | 3 | 4 | 5;

export interface StringUuidOptions {
	version?: UUIDVersion | `${UUIDVersion}-${UUIDVersion}` | null;
	nullable?: boolean;
}

function stringLengthComparator(
	comparator: Comparator,
	name: StringConstraintName,
	expected: string,
	length: number,
	options?: ValidatorOptions
): IConstraint<string> {
	return {
		run(input: string) {
			return comparator(input.length, length) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, options?.message ?? 'Invalid string length', input, expected));
		}
	};
}

export function stringLengthLessThan(length: number, options?: ValidatorOptions): IConstraint<string> {
	const expected = `expected.length < ${length}`;
	return stringLengthComparator(lessThan, 's.string().lengthLessThan()', expected, length, options);
}

export function stringLengthLessThanOrEqual(length: number, options?: ValidatorOptions): IConstraint<string> {
	const expected = `expected.length <= ${length}`;
	return stringLengthComparator(lessThanOrEqual, 's.string().lengthLessThanOrEqual()', expected, length, options);
}

export function stringLengthGreaterThan(length: number, options?: ValidatorOptions): IConstraint<string> {
	const expected = `expected.length > ${length}`;
	return stringLengthComparator(greaterThan, 's.string().lengthGreaterThan()', expected, length, options);
}

export function stringLengthGreaterThanOrEqual(length: number, options?: ValidatorOptions): IConstraint<string> {
	const expected = `expected.length >= ${length}`;
	return stringLengthComparator(greaterThanOrEqual, 's.string().lengthGreaterThanOrEqual()', expected, length, options);
}

export function stringLengthEqual(length: number, options?: ValidatorOptions): IConstraint<string> {
	const expected = `expected.length === ${length}`;
	return stringLengthComparator(equal, 's.string().lengthEqual()', expected, length, options);
}

export function stringLengthNotEqual(length: number, options?: ValidatorOptions): IConstraint<string> {
	const expected = `expected.length !== ${length}`;
	return stringLengthComparator(notEqual, 's.string().lengthNotEqual()', expected, length, options);
}

export function stringEmail(options?: ValidatorOptions): IConstraint<string> {
	return {
		run(input: string) {
			return validateEmail(input)
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError(
							's.string().email()',
							options?.message ?? 'Invalid email address',
							input,
							'expected to be an email address'
						)
					);
		}
	};
}

function stringRegexValidator(type: StringConstraintName, expected: string, regex: RegExp, options?: ValidatorOptions): IConstraint<string> {
	return {
		run(input: string) {
			return regex.test(input) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(type, options?.message ?? 'Invalid string format', input, expected));
		}
	};
}

export function stringUrl(options?: UrlOptions, validatorOptions?: ValidatorOptions): IConstraint<string> {
	const validatorFn = createUrlValidators(options, validatorOptions);
	return {
		run(input: string) {
			let url: URL;
			try {
				url = new URL(input);
			} catch {
				return Result.err(
					new ExpectedConstraintError('s.string().url()', validatorOptions?.message ?? 'Invalid URL', input, 'expected to match a URL')
				);
			}

			const validatorFnResult = validatorFn(input, url);
			if (validatorFnResult === null) return Result.ok(input);
			return Result.err(validatorFnResult);
		}
	};
}

export function stringIp(version?: 4 | 6, options?: ValidatorOptions): IConstraint<string> {
	const ipVersion = version ? (`v${version}` as const) : '';
	const validatorFn = version === 4 ? isIPv4 : version === 6 ? isIPv6 : isIP;

	const name = `s.string().ip${ipVersion}()` as const;
	const message = `Invalid IP${ipVersion} address`;
	const expected = `expected to be an IP${ipVersion} address`;
	return {
		run(input: string) {
			return validatorFn(input)
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, options?.message ?? message, input, expected));
		}
	};
}

export function stringRegex(regex: RegExp, options?: ValidatorOptions) {
	return stringRegexValidator('s.string().regex()', `expected ${regex}.test(expected) to be true`, regex, options);
}

export function stringUuid({ version = 4, nullable = false }: StringUuidOptions = {}, options?: ValidatorOptions) {
	version ??= '1-5';
	const regex = new RegExp(
		`^(?:[0-9A-F]{8}-[0-9A-F]{4}-[${version}][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}${
			nullable ? '|00000000-0000-0000-0000-000000000000' : ''
		})$`,
		'i'
	);
	const expected = `expected to match UUID${typeof version === 'number' ? `v${version}` : ` in range of ${version}`}`;
	return stringRegexValidator('s.string().uuid()', expected, regex, options);
}

export function stringDate(options?: ValidatorOptions): IConstraint<string> {
	return {
		run(input: string) {
			const time = Date.parse(input);

			return Number.isNaN(time)
				? Result.err(
						new ExpectedConstraintError(
							's.string().date()',
							options?.message ?? 'Invalid date string',
							input,
							'expected to be a valid date string (in the ISO 8601 or ECMA-262 format)'
						)
					)
				: Result.ok(input);
		}
	};
}

export function stringPhone(options?: ValidatorOptions): IConstraint<string> {
	return {
		run(input: string) {
			return validatePhoneNumber(input)
				? Result.ok(input)
				: Result.err(
						new ExpectedConstraintError(
							's.string().phone()',
							options?.message ?? 'Invalid phone number',
							input,
							'expected to be a phone number'
						)
					);
		}
	};
}
