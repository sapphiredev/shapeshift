import { BaseConstraintError, type ConstraintErrorNames } from '../../../../src/lib/errors/BaseConstraintError';

describe('BaseConstraintError', () => {
	test('GIVEN constraint, message and value THEN converts to JSON', () => {
		const constraint: ConstraintErrorNames = 's.string().url()';
		const message = 'Test message';
		const given = ['test'];

		// @ts-expect-error abstract class
		const error = new BaseConstraintError(constraint, message, given);
		const json = error.toJSON();

		expect(json).toEqual({
			name: error.name,
			constraint: error.constraint,
			given: error.given,
			message: error.message
		});
	});

	test('GIVEN object formatted constraint, message, and value THEN converts to JSON', () => {
		const constraint: ConstraintErrorNames = 's.array(T).lengthEqual()';
		const message = 'Different test message';
		const given = { test: 'value' };

		// @ts-expect-error abstract class
		const error = new BaseConstraintError(constraint, message, given);
		const json = error.toJSON();

		expect(json).toEqual({
			name: error.name,
			constraint: error.constraint,
			given: error.given,
			message: error.message
		});
	});

	test('GIVEN empty message and value THEN converts to JSON', () => {
		const constraint: ConstraintErrorNames = 's.boolean().false()';
		const message = '';
		const given = null;

		// @ts-expect-error abstract class
		const error = new BaseConstraintError(constraint, message, given);
		const json = error.toJSON();

		expect(json).toEqual({
			name: error.name,
			constraint: error.constraint,
			given: error.given,
			message: error.message
		});
	});
});
