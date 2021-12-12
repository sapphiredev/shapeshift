import { ConstraintError } from '../lib/errors/ConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';

export const booleanTrue: IConstraint<boolean, true> = {
	run(input: boolean) {
		return input //
			? Result.ok(input)
			: Result.err(new ConstraintError('booleanTrue', 'Expected boolean to be true, but received false', input, true));
	}
};

export const booleanFalse: IConstraint<boolean, false> = {
	run(input: boolean) {
		return input //
			? Result.err(new ConstraintError('booleanFalse', 'Expected boolean to be false, but received true', input, false))
			: Result.ok(input);
	}
};
