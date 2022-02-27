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
	});

	describe('Formats', () => {
		describe('email', () => {
			const emailPredicate = s.string.email;

			test.each(['hi@hello.com', 'foo@bar.net', 'hello+world@example.com'])('GIVEN %s THEN returns given value', (input) => {
				expect(emailPredicate.parse(input)).toBe(input);
			});

			test.each(['hi@hello', 'foo@bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
				expect(() => emailPredicate.parse(input)).toThrow(
					new ConstraintError('s.string.email', 'Invalid email address', input, 'expected to be an email address')
				);
			});
		});

		describe('url', () => {
			describe('Without any options', () => {
				const urlPredicate = s.string.url();

				test.each(['https://google.com', 'http://foo.bar'])('GIVEN %s THEN returns given value', (input) => {
					expect(urlPredicate.parse(input)).toBe(input);
				});

				test.each(['google.com', 'foo.bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => urlPredicate.parse(input)).toThrow(new ConstraintError('s.string.url', 'Invalid URL', input, 'expected.url'));
				});
			});

			describe('With protocol', () => {
				const urlPredicateWithProtocol = s.string.url({ allowedProtocols: ['git:'] });

				test.each(['git://foo.bar'])('GIVEN %s THEN returns given value', (input) => {
					expect(urlPredicateWithProtocol.parse(input)).toBe(input);
				});

				test.each(['https://google.com', 'http://foo.bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => urlPredicateWithProtocol.parse(input)).toThrow(
						new ConstraintError('s.string.url', 'Invalid URL protocol', input, 'expected to be one of: git:')
					);
				});
			});

			describe('With domain', () => {
				const urlPredicateWithDomain = s.string.url({ allowedDomains: ['google.com'] });

				test.each(['https://google.com', 'http://google.com'])('GIVEN %s THEN returns given value', (input) => {
					expect(urlPredicateWithDomain.parse(input)).toBe(input);
				});

				test.each(['https://foo.bar', 'http://foo.bar'])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => urlPredicateWithDomain.parse(input)).toThrow(
						new ConstraintError('s.string.url', 'Invalid URL domain', input, 'expected to be one of: google.com')
					);
				});
			});
		});

		describe('uuid', () => {
			describe('uuid5', () => {
				const uuid5Predicate = s.string.uuid(5);

				test.each(['2a7ff881-2944-55ae-94b0-b2ed34432297'])('GIVEN %s THEN returns given value', (input) => {
					expect(uuid5Predicate.parse(input)).toBe(input);
				});

				test.each(['1b671a64-40d5-491e-99b0-da01ff1f3342'])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => uuid5Predicate.parse(input)).toThrow(
						new ConstraintError('s.string.uuid', 'Invalid UUID', input, 'expected UUID v5')
					);
				});
			});

			describe('uuid4', () => {
				const uuid4Predicate = s.string.uuid(4);

				test.each(['450d6a23-9e6f-45d9-9d5a-fd4f6e014f16'])('GIVEN %s THEN returns given value', (input) => {
					expect(uuid4Predicate.parse(input)).toBe(input);
				});

				test.each(['6e8bc430-9a1b-4f7f-b7a5', '6e8bc430-9a1b-4f7f-b7a5', '450d6a23-9e6f-35d9-9d5a-fd4f6e014f16'])(
					'GIVEN %s THEN throws a ConstraintError',
					(input) => {
						expect(() => uuid4Predicate.parse(input)).toThrow(
							new ConstraintError('s.string.uuid', 'Invalid string format', input, 'expected UUID v4')
						);
					}
				);

				test('Given no version then match v4', () => {
					const defaultPredicate = s.string.uuid();
					const input = 'a0d32a64-3843-4475-90f3-7ce5b74168d8';
					expect(uuid4Predicate.parse(input)).toStrictEqual(defaultPredicate.parse(input));
				});
			});

			describe('uuid3', () => {
				const uuid3Predicate = s.string.uuid(3);

				test.each(['6e8bc430-9a1b-4f7f-b7a5'])('GIVEN %s THEN returns given value', (input) => {
					expect(uuid3Predicate.parse(input)).toBe(input);
				});

				test.each(['6e8bc430-9a1b-4f7f-b7a5', '450d6a23-9e6f-35d9-9d5a-fd4f6e014f16'])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => uuid3Predicate.parse(input)).toThrow(
						new ConstraintError('s.string.uuid', 'Invalid string format', input, 'expected UUID v3')
					);
				});
			});

			describe('with version range', () => {
				const uuidRangePredicate = s.string.uuid('1-5');

				test.each([
					'6e8bc430-9a1b-4f7f-b7a5-ea4dede09a4b',
					'6e8bc430-9a1b-1f7f-b7a5-ea4dede09a4b',
					'6e8bc430-9a1b-3f7f-b7a5-ea4dede09a4b',
					'2a7ff881-2944-55ae-94b0-b2ed34432297'
				])('GIVEN %s THEN returns given value', (input) => {
					expect(uuidRangePredicate.parse(input)).toBe(input);
				});

				test.each(['6e8bc430-9a1b-5f7f-b7a5-ea4dede09a4b'])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => uuidRangePredicate.parse(input)).toThrow(
						new ConstraintError('s.string.uuid', 'Invalid string format', input, `expected UUID in range 1-4`)
					);
				});

				describe('Given null version then match v1-5', () => {
					const rangePredicate = s.string.uuid();

					test.each(['a84f1360-9782-11ec-909d-d7f2210bf3b4', '6e8bc430-9a1b-4f7f-b7a5-ea4dede09a4b'])(
						'GIVEN %s THEN returns given value',
						(input) => {
							expect(uuidRangePredicate.parse(input)).toStrictEqual(rangePredicate.parse(input));
						}
					);
				});
			});

			test('Given NIL UUID THEN return NIL UUID', () => {
				const uuidPredicate = s.string.uuid(null);
				expect(uuidPredicate.parse('00000000-0000-0000-0000-000000000000')).toBe('00000000-0000-0000-0000-000000000000');
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
					new ConstraintError('s.string.regex', 'Invalid string format', input, `expected to match ${regex.source}`)
				);
			});
		});

		describe('ip', () => {
			describe('default', () => {
				const ipPredicate = s.string.ip();

				test.each(['::1', '127.0.0.1'])('GIVEN %s THEN returns given value', (input) => {
					expect(ipPredicate.parse(input)).toBe(input);
				});

				test.each(['127.000.000.001', '127.0.0.1/24', 'fhqwhgads'])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => ipPredicate.parse(input)).toThrow(
						new ConstraintError('s.string.ip', 'Invalid ip address', input, 'expected to be an ip address')
					);
				});
			});

			describe('v4', () => {
				const ipv4Predicate = s.string.ipv4;

				test.each(['127.0.0.1'])('GIVEN %s THEN returns given value', (input) => {
					expect(ipv4Predicate.parse(input)).toBe(input);
				});

				test.each(['127.000.000.001', '127.0.0.1/24', 'fhqwhgads'])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => ipv4Predicate.parse(input)).toThrow(
						new ConstraintError('s.string.ipv4', 'Invalid ipv4 address', input, 'expected to be an ipv4 address')
					);
				});
			});

			describe('v6', () => {
				const ipv6Predicate = s.string.ipv6;

				test.each(['::1', '2001:0db8:85a3:0000:0000:8a2e:0370:7334'])('GIVEN %s THEN returns given value', (input) => {
					expect(ipv6Predicate.parse(input)).toBe(input);
				});

				test.each(['fhqwhgads', '2001:0db8:85a3:0000:0000:8a2e:0370:7334/24', '2001:0db8:85a3:0000:0000:8a2e:0370:7334/24/24'])(
					'GIVEN %s THEN throws a ConstraintError',
					(input) => {
						expect(() => ipv6Predicate.parse(input)).toThrow(
							new ConstraintError('s.string.ipv6', 'Invalid ipv6 address', input, 'expected to be an ipv6 address')
						);
					}
				);
			});
		});
	});
});
