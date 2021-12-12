import { ConstraintError, ConstraintErrorMessageBuilder } from '../lib/errors/ConstraintError';
import { Result } from '../lib/Result';
import type { IConstraint } from './base/IConstraint';
import { Comparator, eq, ge, gt, le, lt, ne } from './util/operators';

function dateComparator(
	comparator: Comparator,
	name: string,
	messageBuilder: ConstraintErrorMessageBuilder<Date>,
	date: Date,
	number = date.getTime()
): IConstraint<Date> {
	return {
		run(input: Date) {
			return comparator(input.getTime(), number) //
				? Result.ok(input)
				: Result.err(new ConstraintError(name, messageBuilder(input, date), input, date));
		}
	};
}

export const dateLt = dateComparator.bind(
	null,
	lt,
	'dateLt',
	(given, expected) => `Expected date to be earlier than ${expected}, but received ${given}`
);

export const dateLe = dateComparator.bind(
	null,
	le,
	'dateLe',
	(given, expected) => `Expected date to be earlier or equals than ${expected}, but received ${given}`
);

export const dateGt = dateComparator.bind(
	null,
	gt,
	'dateGt',
	(given, expected) => `Expected date to be later than ${expected}, but received ${given}`
);

export const dateGe = dateComparator.bind(
	null,
	ge,
	'dateGe',
	(given, expected) => `Expected date to be later or equals than ${expected}, but received ${given}`
);

export const dateEq = dateComparator.bind(null, eq, 'dateEq', (given, expected) => `Expected date to be exactly ${expected}, but received ${given}`);
export const dateNe = dateComparator.bind(null, ne, 'dateNe', (_, expected) => `Expected date to not be ${expected}`);

export const dateInvalid: IConstraint<Date> = {
	run(input: Date) {
		return Number.isNaN(input.getTime()) //
			? Result.ok(input)
			: Result.err(new ConstraintError('dateInvalid', `Expected Date's time to be a NaN, but received ${input}`, input, 'An invalid Date'));
	}
};

export const dateValid: IConstraint<Date> = {
	run(input: Date) {
		return Number.isNaN(input.getTime()) //
			? Result.err(new ConstraintError('dateValid', `Expected Date's time to not be a NaN, but received ${input}`, input, 'A valid Date'))
			: Result.ok(input);
	}
};
