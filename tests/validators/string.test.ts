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

			test.each(['hi@hello', 'foo@bar', 'foo@bar.com/', 'foo@bar.com/index?search=ok'])('GIVEN %s THEN throws a ConstraintError', (input) => {
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
			const uuid5 = '2a7ff881-2944-55ae-94b0-b2ed34432297';
			const uuid4 = '450d6a23-9e6f-45d9-9d5a-fd4f6e014f16';
			const uuid3 = '2962d7f2-92f2-3105-8606-2234808bdfc8';
			const uuid1 = 'c310deb0-9785-11ec-8e65-592cb74aa664';
			const nullUuid = '00000000-0000-0000-0000-000000000000';
			const invalidUUids = ['6e8bc430-9a1b-4f7f-b7a5', '6e8bc430-9a1b-4f7f-b7a5'];

			describe('uuid5', () => {
				const uuid5Predicate = s.string.uuid({ version: 5 });

				test.each([uuid5])('GIVEN %s THEN returns given value', (input) => {
					expect(uuid5Predicate.parse(input)).toBe(input);
				});

				test.each([uuid1, uuid3, uuid4])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => uuid5Predicate.parse(input)).toThrow(
						new ConstraintError('s.string.uuid', 'Invalid string format', input, 'expected UUID v5')
					);
				});
			});

			describe('uuid4', () => {
				const uuid4Predicate = s.string.uuid({ version: 4 });

				test.each([uuid4])('GIVEN %s THEN returns given value', (input) => {
					expect(uuid4Predicate.parse(input)).toBe(input);
				});

				test.each([...invalidUUids, uuid5])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => uuid4Predicate.parse(input)).toThrow(
						new ConstraintError('s.string.uuid', 'Invalid string format', input, 'expected UUID v4')
					);
				});

				describe('Default behavior', () => {
					const defaultPredicate = s.string.uuid();
					test('GIVEN v4 UUID THEN return the input', () => {
						expect(uuid4Predicate.parse(uuid4)).toStrictEqual(defaultPredicate.parse(uuid4));
					});

					test.each([uuid1, ...invalidUUids])('GIVEN UUID other than v4 THEN throws a ConstraintError', (input) => {
						expect(() => defaultPredicate.parse(input)).toThrow(
							new ConstraintError('s.string.uuid', 'Invalid string format', input, 'expected UUID v4')
						);
					});
				});
			});

			describe('uuid3', () => {
				const uuid3Predicate = s.string.uuid({ version: 3 });

				test.each([uuid3])('GIVEN %s THEN returns given value', (input) => {
					expect(uuid3Predicate.parse(input)).toBe(input);
				});

				test.each([...invalidUUids, uuid4, uuid5])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => uuid3Predicate.parse(input)).toThrow(
						new ConstraintError('s.string.uuid', 'Invalid string format', input, 'expected UUID v3')
					);
				});
			});

			describe('with version range', () => {
				const uuidRangePredicate = s.string.uuid({ version: '1-4' });

				test.each([uuid1, uuid3, uuid3])('GIVEN %s THEN returns given value', (input) => {
					expect(uuidRangePredicate.parse(input)).toBe(input);
				});

				test.each([uuid5, nullUuid])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => uuidRangePredicate.parse(input)).toThrow(
						new ConstraintError('s.string.uuid', 'Invalid string format', input, `expected UUID in range 1-4`)
					);
				});
			});

			describe('Nullable', () => {
				test('GIVEN NIL UUID THEN returns NIL UUID', () => {
					const uuidPredicate = s.string.uuid({ version: '1-5', nullable: true });
					expect(uuidPredicate.parse(nullUuid)).toBe(nullUuid);
				});
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
					new ConstraintError('s.string.regex', 'Invalid string format', input, `expected ${regex}.test(expected) to be true`)
				);
			});
		});

		describe('ip', () => {
			const v4Ips = ['127.0.0.1'];
			const v6Ips = ['::1', '2001:0db8:85a3:0000:0000:8a2e:0370:7334'];
			const invalidIps = [
				'127.000.000.001',
				'127.0.0.1/24',
				'fhqwhgads',
				'2001:0db8:85a3:0000:0000:8a2e:0370:7334/24',
				'2001:0db8:85a3:0000:0000:8a2e:0370:7334/24/24'
			];
			describe('default', () => {
				const ipPredicate = s.string.ip();

				test.each([...v4Ips, ...v6Ips])('GIVEN %s THEN returns given value', (input) => {
					expect(ipPredicate.parse(input)).toBe(input);
				});

				test.each(invalidIps)('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => ipPredicate.parse(input)).toThrow(
						new ConstraintError('s.string.ip', 'Invalid ip address', input, 'expected to be an ip address')
					);
				});
			});

			describe('v4', () => {
				const ipv4Predicate = s.string.ipv4;

				test.each(v4Ips)('GIVEN %s THEN returns given value', (input) => {
					expect(ipv4Predicate.parse(input)).toBe(input);
				});

				test.each([...v6Ips, ...invalidIps])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => ipv4Predicate.parse(input)).toThrow(
						new ConstraintError('s.string.ipv4', 'Invalid ipv4 address', input, 'expected to be an ipv4 address')
					);
				});
			});

			describe('v6', () => {
				const ipv6Predicate = s.string.ipv6;

				test.each(v6Ips)('GIVEN %s THEN returns given value', (input) => {
					expect(ipv6Predicate.parse(input)).toBe(input);
				});

				test.each([...v4Ips, ...invalidIps])('GIVEN %s THEN throws a ConstraintError', (input) => {
					expect(() => ipv6Predicate.parse(input)).toThrow(
						new ConstraintError('s.string.ipv6', 'Invalid ipv6 address', input, 'expected to be an ipv6 address')
					);
				});
			});
		});
	});
});
