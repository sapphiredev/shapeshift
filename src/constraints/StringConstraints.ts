import { isIP, isIPv4, isIPv6 } from 'node:net';
import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { validateEmail } from './util/emailValidator';
import { Comparator, equal, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, notEqual } from './util/operators';
import { createUrlValidators } from './util/urlValidators';

export type StringConstraintName =
	| `s.string.${
			| `length${'LessThan' | 'LessThanOrEqual' | 'GreaterThan' | 'GreaterThanOrEqual' | 'Equal' | 'NotEqual'}`
			| 'regex'
			| 'url'
			| 'uuid'
			| 'email'
			| `ip${'v4' | 'v6' | ''}`
			| 'date'}`;

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

function stringLengthComparator(comparator: Comparator, name: StringConstraintName, expected: string, length: number): IConstraint<string> {
	return {
		run(input: string) {
			return comparator(input.length, length) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(name, 'Invalid string length', input, expected));
		}
	};
}

export function stringLengthLessThan(length: number): IConstraint<string> {
	const expected = `expected.length < ${length}`;
	return stringLengthComparator(lessThan, 's.string.lengthLessThan', expected, length);
}

export function stringLengthLessThanOrEqual(length: number): IConstraint<string> {
	const expected = `expected.length <= ${length}`;
	return stringLengthComparator(lessThanOrEqual, 's.string.lengthLessThanOrEqual', expected, length);
}

export function stringLengthGreaterThan(length: number): IConstraint<string> {
	const expected = `expected.length > ${length}`;
	return stringLengthComparator(greaterThan, 's.string.lengthGreaterThan', expected, length);
}

export function stringLengthGreaterThanOrEqual(length: number): IConstraint<string> {
	const expected = `expected.length >= ${length}`;
	return stringLengthComparator(greaterThanOrEqual, 's.string.lengthGreaterThanOrEqual', expected, length);
}

export function stringLengthEqual(length: number): IConstraint<string> {
	const expected = `expected.length === ${length}`;
	return stringLengthComparator(equal, 's.string.lengthEqual', expected, length);
}

export function stringLengthNotEqual(length: number): IConstraint<string> {
	const expected = `expected.length !== ${length}`;
	return stringLengthComparator(notEqual, 's.string.lengthNotEqual', expected, length);
}

export function stringEmail(): IConstraint<string> {
	return {
		run(input: string) {
			return validateEmail(input)
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.string.email', 'Invalid email address', input, 'expected to be an email address'));
		}
	};
}

function stringRegexValidator(type: StringConstraintName, expected: string, regex: RegExp): IConstraint<string> {
	return {
		run(input: string) {
			return regex.test(input) //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError(type, 'Invalid string format', input, expected));
		}
	};
}

export function stringUrl(options?: UrlOptions): IConstraint<string> {
	const validatorFn = createUrlValidators(options);
	return {
		run(input: string) {
			let url: URL;
			try {
				url = new URL(input);
			} catch {
				return Result.err(new ExpectedConstraintError('s.string.url', 'Invalid URL', input, 'expected to match an URL'));
			}

			const validatorFnResult = validatorFn(input, url);
			if (validatorFnResult === null) return Result.ok(input);
			return Result.err(validatorFnResult);
		}
	};
}

export function stringIp(version?: 4 | 6): IConstraint<string> {
	const ipVersion = version ? (`v${version}` as const) : '';
	const validatorFn = version === 4 ? isIPv4 : version === 6 ? isIPv6 : isIP;

	const name = `s.string.ip${ipVersion}` as const;
	const message = `Invalid IP${ipVersion} address`;
	const expected = `expected to be an IP${ipVersion} address`;
	return {
		run(input: string) {
			return validatorFn(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, message, input, expected));
		}
	};
}

export function stringRegex(regex: RegExp) {
	return stringRegexValidator('s.string.regex', `expected ${regex}.test(expected) to be true`, regex);
}

export function stringUuid({ version = 4, nullable = false }: StringUuidOptions = {}) {
	version ?? (version = '1-5');

	const regex = new RegExp(
		`^(?:[0-9A-F]{8}-[0-9A-F]{4}-[${version}][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}${
			nullable ? '|00000000-0000-0000-0000-000000000000' : ''
		})$`,
		'i'
	);
	const expected = `expected to match UUID${typeof version === 'number' ? `v${version}` : ` in range of ${version}`}`;
	return stringRegexValidator('s.string.uuid', expected, regex);
}

export function stringDate(): IConstraint<string> {
	return {
		run(input: string) {
			const time = Date.parse(input);

			return Number.isNaN(time)
				? Result.err(
						new ExpectedConstraintError(
							's.string.date',
							'Invalid date string',
							input,
							'expected to be a valid date string (in the ISO 8601 or ECMA-262 format)'
						)
				  )
				: Result.ok(input);
		}
	};
}
