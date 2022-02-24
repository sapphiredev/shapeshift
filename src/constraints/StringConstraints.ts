import { ConstraintError } from '../lib/errors/ConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, ge, gt, le, lt, ne } from './util/operators';

export type StringConstraintName = `s.string.${`length${'Lt' | 'Le' | 'Gt' | 'Ge' | 'Eq' | 'Ne'}` | 'regex' | 'url' | 'uuid' | 'email'}`;
export type StringProtocol = `${string}:`;
export type StringDomain = `${string}.${string}`;

export interface UrlOptions {
	allowedProtocols?: StringProtocol[];
	allowedDomains?: StringDomain[];
}

// from https://stackoverflow.com/a/46181/1550155
export const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

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

export function stringRegex(regex: RegExp, type: 'url' | 'uuid' | 'regex' | 'email'): IConstraint<string> {
	const expected = `expected.${type}`;
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
							`expected.url.protocol in ${options.allowedProtocols.join(', ')}`
						)
					);
				}
				if (options?.allowedDomains && !options.allowedDomains.includes(url.hostname as StringDomain)) {
					return Result.err(
						new ConstraintError(
							's.string.url',
							'Invalid URL domain',
							input,
							`expected.url.domain in ${options.allowedDomains.join(', ')}`
						)
					);
				}

				return Result.ok(input);
			} catch {
				return Result.err(new ConstraintError('s.string.url', 'Invalid URL', input, 'expected.url'));
			}
		}
	};
}
