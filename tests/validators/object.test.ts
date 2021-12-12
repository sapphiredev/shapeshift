import { s, ValidationError } from '../../src';

describe('ObjectValidator', () => {
	const predicate = s.object({
		username: s.string,
		password: s.string
	});

	test('GIVEN a valid object THEN returns processed object', () => {
		expect(predicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({ username: 'Sapphire', password: 'helloworld' });
	});

	test('GIVEN mismatching in one property THEN throws AggregateError with one error', () => {
		expect(() => predicate.parse({ username: 42, password: 'helloworld' })).toThrow(
			new AggregateError(
				[new ValidationError('StringValidator', 'Expected a string primitive', 42)],
				'Failed to match at least one of the properties'
			)
		);
	});

	test('GIVEN mismatching in two properties THEN throws AggregateError with two errors', () => {
		expect(() => predicate.parse({ username: 42, password: true })).toThrow(
			new AggregateError(
				[
					new ValidationError('StringValidator', 'Expected a string primitive', 42),
					new ValidationError('StringValidator', 'Expected a string primitive', true)
				],
				'Failed to match at least one of the properties'
			)
		);
	});
});
