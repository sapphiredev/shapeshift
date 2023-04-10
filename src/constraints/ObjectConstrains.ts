import get from 'lodash/get.js';
import { Result } from '../lib/Result';
import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import type { ValidatorOptions } from '../lib/util-types';
import type { BaseValidator } from '../validators/BaseValidator';
import type { IConstraint } from './base/IConstraint';

export type ObjectConstraintName = `s.object(T.when)`;

export type WhenKey = PropertyKey | PropertyKey[];

export interface WhenOptions<T extends BaseValidator<any>, Key extends WhenKey> {
	is?: boolean | ((value: Key extends Array<any> ? any[] : any) => boolean);
	then: (predicate: T) => T;
	otherwise?: (predicate: T) => T;
}

export function whenConstraint<T extends BaseValidator<any>, I, Key extends WhenKey>(
	key: Key,
	options: WhenOptions<T, Key>,
	validator: T,
	validatorOptions?: ValidatorOptions
): IConstraint<I> {
	return {
		run(input: I, parent?: any) {
			if (!parent) {
				return Result.err(
					new ExpectedConstraintError(
						's.object(T.when)',
						validatorOptions?.message ?? 'Validator has no parent',
						parent,
						'Validator to have a parent'
					)
				);
			}

			const isKeyArray = Array.isArray(key);

			const value = isKeyArray ? key.map((k) => get(parent, k)) : get(parent, key);

			const predicate = resolveBooleanIs<T, Key>(options, value, isKeyArray) ? options.then : options.otherwise;

			if (predicate) {
				return predicate(validator).run(input) as Result<I, ExpectedConstraintError<I>>;
			}

			return Result.ok(input);
		}
	};
}

function resolveBooleanIs<T extends BaseValidator<any>, Key extends WhenKey>(options: WhenOptions<T, Key>, value: any, isKeyArray: boolean) {
	if (options.is === undefined) {
		return isKeyArray ? !value.some((val: any) => !val) : Boolean(value);
	}

	if (typeof options.is === 'function') {
		return options.is(value);
	}

	return value === options.is;
}
