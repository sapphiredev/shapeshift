import { ExpectedConstraintError } from '../lib/errors/ExpectedConstraintError';
import { Result } from '../lib/Result';
import type { ValidatorOptions } from '../lib/util-types';
import type { IConstraint } from './base/IConstraint';

export type BooleanConstraintName = `s.boolean().${boolean}()`;

export function booleanTrue(options?: ValidatorOptions): IConstraint<boolean, true> {
	return {
		run(input: boolean) {
			return input //
				? Result.ok(input)
				: Result.err(new ExpectedConstraintError('s.boolean().true()', options?.message ?? 'Invalid boolean value', input, 'true'));
		}
	};
}

export function booleanFalse(options?: ValidatorOptions): IConstraint<boolean, false> {
	return {
		run(input: boolean) {
			return input //
				? Result.err(new ExpectedConstraintError('s.boolean().false()', options?.message ?? 'Invalid boolean value', input, 'false'))
				: Result.ok(input);
		}
	};
}
