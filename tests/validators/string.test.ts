import { ConstraintError, s, ValidationError } from '../../src';

describe('StringValidator', () => {
	const predicate = s.string;

	test('GIVEN a string THEN returns a string', () => {
		expect(predicate.parse('Hello There')).toBe('Hello There');
	});

	test('GIVEN a non-string THEN throws ValidationError', () => {
		expect(() => predicate.parse(42)).toThrow(new ValidationError('StringValidator', 'Expected a string primitive', 42));
	});

	describe('Comparators', () => {
		describe('lengthLt', () => {
			const lengthLtPredicate = s.string.lengthLt(5);

			test.each(['Hi'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthLtPredicate.parse(input)).toBe(input);
			});

			test.each(['Hello', 'Foo Bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthLtPredicate.parse(input)).toThrow(
					new ConstraintError('s.string.lengthLt', 'Invalid string length', input, 'expected.length < 5')
				);
			});
		});

		describe('lengthLe', () => {
			const lengthLePredicate = s.string.lengthLe(5);

			test.each(['Hi', 'Hello'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthLePredicate.parse(input)).toBe(input);
			});

			test.each(['Foo Bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthLePredicate.parse(input)).toThrow(
					new ConstraintError('s.string.lengthLt', 'Invalid string length', input, 'expected.length <= 5')
				);
			});
		});

		describe('lengthGt', () => {
			const lengthGtPredicate = s.string.lengthGt(5);

			test.each(['Foo Bar'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthGtPredicate.parse(input)).toBe(input);
			});

			test.each(['Hi', 'Hello'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthGtPredicate.parse(input)).toThrow(
					new ConstraintError('s.string.lengthGt', 'Invalid string length', input, 'expected.length > 5')
				);
			});
		});

		describe('lengthGe', () => {
			const lengthGePredicate = s.string.lengthGe(5);

			test.each(['Hello', 'Foo Bar'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthGePredicate.parse(input)).toBe(input);
			});

			test.each(['Hi'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthGePredicate.parse(input)).toThrow(
					new ConstraintError('s.string.lengthGe', 'Invalid string length', input, 'expected.length >= 5')
				);
			});
		});

		describe('lengthEq', () => {
			const lengthEqPredicate = s.string.lengthEq(5);

			test.each(['Hello'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthEqPredicate.parse(input)).toBe(input);
			});

			test.each(['Hi', 'Foo Bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthEqPredicate.parse(input)).toThrow(
					new ConstraintError('s.string.lengthEq', 'Invalid string length', input, 'expected.length === 5')
				);
			});
		});

		describe('lengthNe', () => {
			const lengthNePredicate = s.string.lengthNe(5);

			test.each(['Hi', 'Foo Bar'])('GIVEN %s THEN returns given value', (input) => {
				expect(lengthNePredicate.parse(input)).toBe(input);
			});

			test.each(['Hello'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => lengthNePredicate.parse(input)).toThrow(
					new ConstraintError('s.string.lengthNe', 'Invalid string length', input, 'expected.length === 5')
				);
			});
		});

		describe('email', () => {
			const emailPredicate = s.string.email();

			test.each(['hi@hello.com', 'foo@bar.net'])('GIVEN %s THEN returns given value', (input) => {
				expect(emailPredicate.parse(input)).toBe(input);
			});

			test.each(['hi@hello', 'foo@bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => emailPredicate.parse(input)).toThrow(
					new ConstraintError('s.string.email', 'Invalid string format', input, 'expected.email')
				);
			});
		});

		describe('url', () => {
			const urlPredicate = s.string.url();

			test.each(['https://google.com', 'http://foo.bar'])('GIVEN %s THEN returns given value', (input) => {
				expect(urlPredicate.parse(input)).toBe(input);
			});

			test.each(['google.com', 'foo.bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => urlPredicate.parse(input)).toThrow(new ConstraintError('s.string.url', 'Invalid URL', input, 'expected.url'));
			});

			const urlPredicateWithProtocol = s.string.url({ allowedProtocols: ['git:'] });

			test.each(['git://foo.bar'])('GIVEN %s THEN returns given value', (input) => {
				expect(urlPredicateWithProtocol.parse(input)).toBe(input);
			});

			test.each(['https://google.com', 'http://foo.bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => urlPredicateWithProtocol.parse(input)).toThrow(
					new ConstraintError('s.string.url', 'Invalid URL protocol', input, 'expected.url')
				);
			});

			const urlPredicateWithDomain = s.string.url({ allowedDomains: ['google.com'] });

			test.each(['https://google.com', 'http://google.com'])('GIVEN %s THEN returns given value', (input) => {
				expect(urlPredicateWithDomain.parse(input)).toBe(input);
			});

			test.each(['https://foo.bar', 'http://foo.bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => urlPredicateWithDomain.parse(input)).toThrow(
					new ConstraintError('s.string.url', 'Invalid URL domain', input, 'expected.url')
				);
			});
		});

		describe('uuid', () => {
			const uuidPredicate = s.string.uuid();

			test.each(['6e8bc430-9a1b-4f7f-b7a5-ea4dede09a4b'])('GIVEN %s THEN returns given value', (input) => {
				expect(uuidPredicate.parse(input)).toBe(input);
			});

			test.each(['6e8bc430-9a1b-4f7f-b7a5', '6e8bc430-9a1b-4f7f-b7a5'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => uuidPredicate.parse(input)).toThrow(
					new ConstraintError('s.string.uuid', 'Invalid string format', input, 'expected.uuid')
				);
			});

			const uuidRangePredicate = s.string.uuid('1-4');

			test.each(['6e8bc430-9a1b-4f7f-b7a5-ea4dede09a4b', '6e8bc430-9a1b-1f7f-b7a5-ea4dede09a4b', '6e8bc430-9a1b-3f7f-b7a5-ea4dede09a4b'])(
				'GIVEN %s THEN returns given value',
				(input) => {
					expect(uuidRangePredicate.parse(input)).toBe(input);
				}
			);

			test.each(['6e8bc430-9a1b-5f7f-b7a5-ea4dede09a4b'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => uuidRangePredicate.parse(input)).toThrow(
					new ConstraintError('s.string.uuid', 'Invalid string format', input, 'expected.uuid')
				);
			});
		});

		describe('regex', () => {
			const regex = /^[a-z]+$/;
			const regexPredicate = s.string.regex(regex);

			test.each(['abc', 'xyz'])('GIVEN %s THEN returns given value', (input) => {
				expect(regexPredicate.parse(input)).toBe(input);
			});

			test.each(['ABC', '123A'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => regexPredicate.parse(input)).toThrow(
					new ConstraintError('s.string.regex', 'Invalid string format', input, `expected.regex`)
				);
			});
		});
	});
});
