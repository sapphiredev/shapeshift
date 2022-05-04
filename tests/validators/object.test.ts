import { CombinedPropertyError, MissingPropertyError, s, UnknownPropertyError, ValidationError } from '../../src';
import { expectError } from '../common/macros/comparators';

describe('ObjectValidator', () => {
	const predicate = s.object({
		username: s.string,
		password: s.string
	});

	test('GIVEN a non-object value THEN throws ValidationError', () => {
		expectError(
			() => predicate.parse('hello'),
			new ValidationError('s.object(T)', 'Expected the value to be an object, but received string instead', 'hello')
		);
	});

	test('GIVEN a null object value THEN throws ValidationError', () => {
		expectError(() => predicate.parse(null), new ValidationError('s.object(T)', 'Expected the value to not be null', null));
	});

	test('GIVEN an array value THEN throws ValidationError', () => {
		expectError(() => predicate.parse([]), new ValidationError('s.object(T)', 'Expected the value to not be an array', []));
	});

	test('GIVEN a valid object THEN returns processed object', () => {
		expect(predicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({ username: 'Sapphire', password: 'helloworld' });
	});

	test('GIVEN mismatching in one property THEN throws CombinedError with one error', () => {
		expectError(
			() => predicate.parse({ username: 42, password: 'helloworld' }),
			new CombinedPropertyError([
				//
				['username', new ValidationError('s.string', 'Expected a string primitive', 42)]
			])
		);
	});

	test('GIVEN mismatching in two properties THEN throws CombinedError with two errors', () => {
		expectError(
			() => predicate.parse({ username: 42, password: true }),
			new CombinedPropertyError([
				['username', new ValidationError('s.string', 'Expected a string primitive', 42)],
				['password', new ValidationError('s.string', 'Expected a string primitive', true)]
			])
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

		test('GIVEN mismatching in one property THEN throws CombinedError with one error', () => {
			expectError(
				() => strictPredicate.parse({ username: 42, password: 'helloworld' }),
				new CombinedPropertyError([
					//
					['username', new ValidationError('s.string', 'Expected a string primitive', 42)]
				])
			);
		});

		test('GIVEN mismatching in one property and one unknown key THEN throws CombinedError with two errors', () => {
			expectError(
				() => strictPredicate.parse({ username: 42, password: 'helloworld', foo: 'bar' }),
				new CombinedPropertyError([
					['username', new ValidationError('s.string', 'Expected a string primitive', 42)],
					['foo', new UnknownPropertyError('foo', 'bar')]
				])
			);
		});

		test('GIVEN mismatching in one property and one missing key THEN throws CombinedError with two errors', () => {
			expectError(
				() => strictPredicate.parse({ username: 42, foo: 'owo' }),
				new CombinedPropertyError([
					['username', new ValidationError('s.string', 'Expected a string primitive', 42)],
					['password', new MissingPropertyError('password')],
					['foo', new UnknownPropertyError('foo', 'owo')]
				])
			);
		});

		const optionalStrict = strictPredicate.extend({
			optionalKey: s.string.optional
		});

		test('GIVEN matching keys and values without optional keys THEN returns no errors', () => {
			expect(optionalStrict.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld'
			});
		});
	});

	describe('Ignore', () => {
		const ignorePredicate = predicate.ignore;

		test('GIVEN matching keys and values THEN returns no errors', () => {
			expect(ignorePredicate.parse({ username: 'Sapphire', password: 'helloworld', email: 'foo@bar.com' })).toStrictEqual({
				username: 'Sapphire',
				password: 'helloworld'
			});
		});

		test('GIVEN missing keys THEN throws CombinedPropertyError with MissingPropertyError', () => {
			expectError(
				() => ignorePredicate.parse({ username: 'Sapphire' }),
				new CombinedPropertyError([['password', new MissingPropertyError('password')]])
			);
		});
	});

	describe('Passthrough', () => {
		const passthroughPredicate = predicate.passthrough;

		test('GIVEN matching keys and values THEN returns no errors', () => {
			expect(passthroughPredicate.parse({ username: 'Sapphire', password: 'helloworld', email: 'foo@bar.com' })).toStrictEqual({
				email: 'foo@bar.com',
				username: 'Sapphire',
				password: 'helloworld'
			});
		});

		test('GIVEN missing keys THEN throws CombinedPropertyError with MissingPropertyError', () => {
			expectError(
				() => passthroughPredicate.parse({ username: 'Sapphire' }),
				new CombinedPropertyError([['password', new MissingPropertyError('password')]])
			);
		});
	});

	describe('Partial', () => {
		const partialPredicate = predicate.partial;

		test('GIVEN empty object THEN returns an empty object', () => {
			expect(partialPredicate.parse({})).toStrictEqual({});
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

	test('GIVEN clone THEN returns similar instance', () => {
		// @ts-expect-error Test clone
		const clonePredicate = predicate.clone();

		expect(clonePredicate).toBeInstanceOf(predicate.constructor);
		expect(clonePredicate.parse({ username: 'Sapphire', password: 'helloworld' })).toStrictEqual(
			predicate.parse({ username: 'Sapphire', password: 'helloworld' })
		);
	});
});
