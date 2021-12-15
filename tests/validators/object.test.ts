import { MissingPropertyError, s, UnknownPropertyError, ValidationError } from '../../src';

describe('ObjectValidator', () => {
	const predicate = s.object({
		username: s.string,
		password: s.string
	});

	test('GIVEN a non-object value THEN throws ValidationError', () => {
		expect(() => predicate.parse('hello')).toThrow(new ValidationError('ObjectValidator', 'Expected an object', 'hello'));
	});

	test('GIVEN a null object value THEN throws ValidationError', () => {
		expect(() => predicate.parse(null)).toThrow(new ValidationError('ObjectValidator', 'Expected object to not be null', null));
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

	describe('Strict', () => {
		const strictPredicate = predicate.strict;

		test('GIVEN matching keys and values THEN returns no errors', () => {
			expect(strictPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld'
			});
		});

		test('GIVEN mismatching in one property THEN throws AggregateError with one error', () => {
			expect(() => strictPredicate.parse({ username: 42, password: 'helloworld' })).toThrow(
				new AggregateError(
					[new ValidationError('StringValidator', 'Expected a string primitive', 42)],
					'Failed to match at least one of the properties'
				)
			);
		});

		test('GIVEN mismatching in one property and one unknown key THEN throws AggregateError with two errors', () => {
			expect(() => strictPredicate.parse({ username: 42, password: 'helloworld', foo: 'bar' })).toThrow(
				new AggregateError(
					[new UnknownPropertyError('foo', 'bar'), new ValidationError('StringValidator', 'Expected a string primitive', 42)],
					'Failed to match at least one of the properties'
				)
			);
		});

		test('GIVEN mismatching in one property and one missing key THEN throws AggregateError with two errors', () => {
			expect(() => strictPredicate.parse({ username: 42, foo: 'owo' })).toThrow(
				new AggregateError(
					[new UnknownPropertyError('foo', 'owo'), new MissingPropertyError('password')],
					'Failed to match at least one of the properties'
				)
			);
		});
	});

	describe('Partial', () => {
		const partialPredicate = predicate.partial;

		test('GIVEN empty object THEN returns an object with undefined values', () => {
			expect(partialPredicate.parse({})).toStrictEqual({ username: undefined, password: undefined });
		});
	});

	describe('Extend', () => {
		test('GIVEN a plain object THEN returns a predicate validator with merged shapes', () => {
			const extendPredicate = predicate.extend({ foo: s.number });

			expect(Object.keys(extendPredicate.shape)).toStrictEqual(['username', 'password', 'foo']);
			expect(extendPredicate.parse({ username: 'Sapphire', password: 'helloworld', foo: 42 })).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld',
				foo: 42
			});
		});

		test('GIVEN an object predicate THEN returns a predicate validator with merged shapes', () => {
			const extendPredicate = predicate.extend(s.object({ foo: s.number }));

			expect(Object.keys(extendPredicate.shape)).toStrictEqual(['username', 'password', 'foo']);
			expect(extendPredicate.parse({ username: 'Sapphire', password: 'helloworld', foo: 42 })).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld',
				foo: 42
			});
		});
	});

	describe('Pick', () => {
		test('GIVEN no keys THEN returns an empty predicate validator', () => {
			const pickPredicate = predicate.pick([]);

			expect(Object.keys(pickPredicate.shape)).toStrictEqual([]);
			expect(pickPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({});
		});

		test('GIVEN one key THEN returns a subset of the object predicate', () => {
			const pickPredicate = predicate.pick(['password']);

			expect(Object.keys(pickPredicate.shape)).toStrictEqual(['password']);
			expect(pickPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({ password: 'helloworld' });
		});

		test('GIVEN an unknown key THEN is ignored from the new object predicate', () => {
			const pickPredicate = predicate.pick(['password', 'foo' as any]);

			expect(Object.keys(pickPredicate.shape)).toStrictEqual(['password']);
			expect(pickPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({ password: 'helloworld' });
		});
	});

	describe('Omit', () => {
		test('GIVEN no keys THEN returns a clone of the predicate validator', () => {
			const pickPredicate = predicate.omit([]);

			expect(Object.keys(pickPredicate.shape)).toStrictEqual(['username', 'password']);
			expect(pickPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld'
			});
		});

		test('GIVEN one key THEN returns a subset of the object predicate', () => {
			const pickPredicate = predicate.omit(['password']);

			expect(Object.keys(pickPredicate.shape)).toStrictEqual(['username']);
			expect(pickPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({ username: 'Sapphire' });
		});

		test('GIVEN an unknown key THEN is ignored from the new object predicate', () => {
			const pickPredicate = predicate.omit(['password', 'foo' as any]);

			expect(Object.keys(pickPredicate.shape)).toStrictEqual(['username']);
			expect(pickPredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({ username: 'Sapphire' });
		});
	});
});
