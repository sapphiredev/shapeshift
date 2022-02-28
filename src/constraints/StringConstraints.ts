import { ConstraintError } from '../lib/errors/ConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, ge, gt, le, lt, ne } from './util/operators';
import { isIP, isIPv4, isIPv6 } from 'node:net';
import { validateEmail } from './util/emailValidator';

export type StringConstraintName =
	| `s.string.${`length${'Lt' | 'Le' | 'Gt' | 'Ge' | 'Eq' | 'Ne'}` | 'regex' | 'url' | 'uuid' | 'email' | `ip${'v4' | 'v6' | ''}`}`;

export type StringProtocol = `${string}:`;

export type StringDomain = `${string}.${string}`;

export interface UrlOptions {
	allowedProtocols?: StringProtocol[];
	allowedDomains?: StringDomain[];
}

export interface StringUuidOptions {
	version?: 1 | 3 | 4 | 5 | `${bigint}-${bigint}` | null;
	nullable?: boolean;
}

function stringLengthComparator(comparator: Comparator, name: StringConstraintName, expected: string, length: number): IConstraint<string> {
	return {
		run(input: string) {
			return comparator(input.length, length) //
				? Result.ok(input)
				: Result.err(new ConstraintError(name, 'Invalid string length', input, expected));
		}
	};
}

export function stringLengthLt(length: number): IConstraint<string> {
	const expected = `expected.length < ${length}`;
	return stringLengthComparator(lt, 's.string.lengthLt', expected, length);
}

export function stringLengthLe(length: number): IConstraint<string> {
	const expected = `expected.length <= ${length}`;
	return stringLengthComparator(le, 's.string.lengthLe', expected, length);
}

export function stringLengthGt(length: number): IConstraint<string> {
	const expected = `expected.length > ${length}`;
	return stringLengthComparator(gt, 's.string.lengthGt', expected, length);
}

export function stringLengthGe(length: number): IConstraint<string> {
	const expected = `expected.length >= ${length}`;
	return stringLengthComparator(ge, 's.string.lengthGe', expected, length);
}

export function stringLengthEq(length: number): IConstraint<string> {
	const expected = `expected.length === ${length}`;
	return stringLengthComparator(eq, 's.string.lengthEq', expected, length);
}

export function stringLengthNe(length: number): IConstraint<string> {
	const expected = `expected.length !== ${length}`;
	return stringLengthComparator(ne, 's.string.lengthNe', expected, length);
}

export function stringEmail(): IConstraint<string> {
	return {
		run(input: string) {
			return validateEmail(input)
				? Result.ok(input)
				: Result.err(new ConstraintError('s.string.email', 'Invalid email address', input, 'expected to be an email address'));
		}
	};
}

function stringRegexValidator(type: StringConstraintName, expected: string, regex: RegExp): IConstraint<string> {
	return {
		run(input: string) {
			return regex.test(input) //
				? Result.ok(input)
				: Result.err(new ConstraintError(type, 'Invalid string format', input, expected));
		}
	};
}

export function stringUrl(options?: UrlOptions): IConstraint<string> {
	return {
		run(input: string) {
			try {
				const url = new URL(input);

				// TODO(kyranet): optimize the option checks
				if (options?.allowedProtocols && !options.allowedProtocols.includes(url.protocol as StringProtocol)) {
					return Result.err(
						new ConstraintError(
							's.string.url',
							'Invalid URL protocol',
							input,
							`expected ${url.protocol} to be one of: ${options.allowedProtocols.join(', ')}`
						)
					);
				}
				if (options?.allowedDomains && !options.allowedDomains.includes(url.hostname as StringDomain)) {
					return Result.err(
						new ConstraintError(
							's.string.url',
							'Invalid URL domain',
							input,
							`expected ${url.hostname} to be one of: ${options.allowedDomains.join(', ')}`
						)
					);
				}

				return Result.ok(input);
			} catch {
				return Result.err(new ConstraintError('s.string.url', 'Invalid URL', input, 'expected to match an URL'));
			}
		}
	};
}

export function stringIp(version?: 4 | 6): IConstraint<string> {
	const ipVersion = version ? `v${version}` : '';
	return {
		run(input: string) {
			return (version === 4 ? isIPv4(input) : version === 6 ? isIPv6(input) : isIP(input)) //
				? Result.ok(input)
				: Result.err(
						new ConstraintError(
							`s.string.ip${ipVersion}` as StringConstraintName,
							`Invalid ip${ipVersion} address`,
							input,
							`expected to be an ip${ipVersion} address`
						)
				  );
		}
	};
}

export function stringRegex(regex: RegExp) {
	return stringRegexValidator('s.string.regex', `expected ${regex}.test(expected) to be true`, regex);
}

export function stringUuid({ version = 4, nullable = false }: StringUuidOptions = {}) {
	version ??= '1-5';
	const regex = new RegExp(
		`^(?:[0-9A-F]{8}-[0-9A-F]{4}-[${version}][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}${
			nullable ? '|00000000-0000-0000-0000-000000000000' : ''
		})$`,
		'i'
	);
	const expected = `expected to match UUID${typeof version === 'number' ? `v${version}` : ` in range of ${version}`}`;
	return stringRegexValidator('s.string.uuid', expected, regex);
}
