import { ConstraintError } from '../lib/errors/ConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, ge, gt, le, lt, ne } from './util/operators';
import net from 'net';

export type StringConstraintName =
	| `s.string.${`length${'Lt' | 'Le' | 'Gt' | 'Ge' | 'Eq' | 'Ne'}` | 'regex' | 'url' | 'uuid' | 'email'}`
	| StringIpName;

export type StringIpName = `s.string.ip${'v4' | 'v6' | ''}`;

export type StringProtocol = `${string}:`;

export type StringDomain = `${string}.${string}`;

export interface UrlOptions {
	allowedProtocols?: StringProtocol[];
	allowedDomains?: StringDomain[];
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

export function stringRegex(regex: RegExp, type: 'url' | 'uuid' | 'regex'): IConstraint<string> {
	const expected = `expected to match ${type === 'regex' ? regex.source : `a ${type}`}`;
	return {
		run(input: string) {
			return regex.test(input) //
				? Result.ok(input)
				: Result.err(new ConstraintError(`s.string.${type}`, 'Invalid string format', input, expected));
		}
	};
}

export function stringUrl(options?: UrlOptions): IConstraint<string> {
	return {
		run(input: string) {
			try {
				const url = new URL(input);

				// TODO: optimize theses checks
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
			return (version === 4 ? net.isIPv4(input) : version === 6 ? net.isIPv6(input) : net.isIP(input)) //
				? Result.ok(input)
				: Result.err(
						new ConstraintError(
							`s.string.ip${ipVersion}` as StringIpName,
							`Invalid ip${ipVersion} address`,
							input,
							`expected to be an ip${ipVersion} address`
						)
				  );
		}
	};
}
