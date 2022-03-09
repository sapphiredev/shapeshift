import { ExpectedConstraintError, MultiplePossibilitiesConstraintError, s, ValidationError } from '../../src';
import { expectError } from '../common/macros/comparators';

describe('StringValidator', () => {
	const predicate = s.string;

	test('GIVEN a string THEN returns a string', () => {
		expect(predicate.parse('Hello There')).toBe('Hello There');
	});

	test('GIVEN a non-string THEN throws ValidationError', () => {
		expectError(() => predicate.parse(42), new ValidationError('s.string', 'Expected a string primitive', 42));
	});

	describe('Comparators', () => {
		describe('lengthLt', () => {
			const lengthLtPredicate = s.string.lengthLt(5);

			test.each(['Hi'])('GIVEN %p THEN returns given value', (input) => {
				expect(lengthLtPredicate.parse(input)).toBe(input);
			});

			test.each(['Hello', 'Foo Bar'])('GIVEN %p THEN throws a ConstraintError', (input) => {
				expectError(
					() => lengthLtPredicate.parse(input),
					new ExpectedConstraintError('s.string.lengthLt', 'Invalid string length', input, 'expected.length < 5')
				);
			});
		});

		describe('lengthLe', () => {
			const lengthLePredicate = s.string.lengthLe(5);

			test.each(['Hi', 'Hello'])('GIVEN %p THEN returns given value', (input) => {
				expect(lengthLePredicate.parse(input)).toBe(input);
			});

			test.each(['Foo Bar'])('GIVEN %p THEN throws a ConstraintError', (input) => {
				expectError(
					() => lengthLePredicate.parse(input),
					new ExpectedConstraintError('s.string.lengthLe', 'Invalid string length', input, 'expected.length <= 5')
				);
			});
		});

		describe('lengthGt', () => {
			const lengthGtPredicate = s.string.lengthGt(5);

			test.each(['Foo Bar'])('GIVEN %p THEN returns given value', (input) => {
				expect(lengthGtPredicate.parse(input)).toBe(input);
			});

			test.each(['Hi', 'Hello'])('GIVEN %p THEN throws a ConstraintError', (input) => {
				expectError(
					() => lengthGtPredicate.parse(input),
					new ExpectedConstraintError('s.string.lengthGt', 'Invalid string length', input, 'expected.length > 5')
				);
			});
		});

		describe('lengthGe', () => {
			const lengthGePredicate = s.string.lengthGe(5);

			test.each(['Hello', 'Foo Bar'])('GIVEN %p THEN returns given value', (input) => {
				expect(lengthGePredicate.parse(input)).toBe(input);
			});

			test.each(['Hi'])('GIVEN %p THEN throws a ConstraintError', (input) => {
				expectError(
					() => lengthGePredicate.parse(input),
					new ExpectedConstraintError('s.string.lengthGe', 'Invalid string length', input, 'expected.length >= 5')
				);
			});
		});

		describe('lengthEq', () => {
			const lengthEqPredicate = s.string.lengthEq(5);

			test.each(['Hello'])('GIVEN %p THEN returns given value', (input) => {
				expect(lengthEqPredicate.parse(input)).toBe(input);
			});

			test.each(['Hi', 'Foo Bar'])('GIVEN %p THEN throws a ConstraintError', (input) => {
				expectError(
					() => lengthEqPredicate.parse(input),
					new ExpectedConstraintError('s.string.lengthEq', 'Invalid string length', input, 'expected.length === 5')
				);
			});
		});

		describe('lengthNe', () => {
			const lengthNePredicate = s.string.lengthNe(5);

			test.each(['Hi', 'Foo Bar'])('GIVEN %p THEN returns given value', (input) => {
				expect(lengthNePredicate.parse(input)).toBe(input);
			});

			test.each(['Hello'])('GIVEN %p THEN throws a ConstraintError', (input) => {
				expectError(
					() => lengthNePredicate.parse(input),
					new ExpectedConstraintError('s.string.lengthNe', 'Invalid string length', input, 'expected.length !== 5')
				);
			});
		});
	});

	describe('Formats', () => {
		describe('email', () => {
			const emailPredicate = s.string.email;

			test.each(['hi@hello.com', 'foo@bar.net', 'hello+world@example.com'])('GIVEN %p THEN returns given value', (input) => {
				expect(emailPredicate.parse(input)).toBe(input);
			});

			test.each(['hi@hello', 'foo@bar', 'foo@bar.com/', 'foo@bar.com/index?search=ok'])('GIVEN %p THEN throws a ConstraintError', (input) => {
				expectError(
					() => emailPredicate.parse(input),
					new ExpectedConstraintError('s.string.email', 'Invalid email address', input, 'expected to be an email address')
				);
			});
		});

		describe('url', () => {
			describe('Without any options', () => {
				const urlPredicate = s.string.url();

				test.each(['https://google.com', 'http://foo.bar'])('GIVEN %p THEN returns given value', (input) => {
					expect(urlPredicate.parse(input)).toBe(input);
				});

				test.each(['google.com', 'foo.bar'])('GIVEN %p THEN throws a ConstraintError', (input) => {
					expectError(
						() => urlPredicate.parse(input),
						new ExpectedConstraintError('s.string.url', 'Invalid URL', input, 'expected to match an URL')
					);
				});
			});

			describe('With protocol', () => {
				const urlPredicateWithProtocol = s.string.url({ allowedProtocols: ['git:'] });

				test.each(['git://foo.bar'])('GIVEN %p THEN returns given value', (input) => {
					expect(urlPredicateWithProtocol.parse(input)).toBe(input);
				});

				test.each(['https://google.com', 'http://foo.bar'])('GIVEN %p THEN throws a ConstraintError', (input) => {
					expectError(
						() => urlPredicateWithProtocol.parse(input),
						new MultiplePossibilitiesConstraintError('s.string.url', 'Invalid URL protocol', input, ['git:'])
					);
				});
			});

			describe('With domain', () => {
				const urlPredicateWithDomain = s.string.url({ allowedDomains: ['google.com'] });

				test.each(['https://google.com', 'http://google.com'])('GIVEN %p THEN returns given value', (input) => {
					expect(urlPredicateWithDomain.parse(input)).toBe(input);
				});

				test.each(['https://foo.bar', 'http://foo.bar'])('GIVEN %p THEN throws a ConstraintError', (input) => {
					expectError(
						() => urlPredicateWithDomain.parse(input),
						new MultiplePossibilitiesConstraintError('s.string.url', 'Invalid URL domain', input, ['google.com'])
					);
				});
			});

			describe('With domain and protocol', () => {
				const urlPredicateWithDomainAndProtocol = s.string.url({
					allowedProtocols: ['https:'],
					allowedDomains: ['google.com', 'example.org']
				});

				test.each(['https://google.com', 'https://example.org'])('GIVEN %p THEN returns given value', (input) => {
					expect(urlPredicateWithDomainAndProtocol.parse(input)).toBe(input);
				});

				test.each(['http://example.org', 'git://example.org'])('GIVEN %p THEN throws a ConstraintError', (input) => {
					expectError(
						() => urlPredicateWithDomainAndProtocol.parse(input),
						new MultiplePossibilitiesConstraintError('s.string.url', 'Invalid URL protocol', input, ['https:'])
					);
				});

				test.each(['https://discord.js.org', 'https://google.es'])('GIVEN %p THEN throws a ConstraintError', (input) => {
					expectError(
						() => urlPredicateWithDomainAndProtocol.parse(input),
						new MultiplePossibilitiesConstraintError('s.string.url', 'Invalid URL domain', input, ['google.com', 'example.org'])
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
			const invalidUuids = ['6e8bc430-9a1b-4f7f-b7a5', '6e8bc430-9a1b-4f7f-b7a5'];

			describe('uuid5', () => {
				const uuid5Predicate = s.string.uuid({ version: 5 });

				test.each([uuid5])('GIVEN %p THEN returns given value', (input) => {
					expect(uuid5Predicate.parse(input)).toBe(input);
				});

				test.each([uuid1, uuid3, uuid4])('GIVEN %p THEN throws a ConstraintError', (input) => {
					expectError(
						() => uuid5Predicate.parse(input),
						new ExpectedConstraintError('s.string.uuid', 'Invalid string format', input, 'expected to match UUIDv5')
					);
				});
			});

			describe('uuid4', () => {
				const uuid4Predicate = s.string.uuid({ version: 4 });

				test.each([uuid4])('GIVEN %p THEN returns given value', (input) => {
					expect(uuid4Predicate.parse(input)).toBe(input);
				});

				test.each([...invalidUuids, uuid5])('GIVEN %p THEN throws a ConstraintError', (input) => {
					expectError(
						() => uuid4Predicate.parse(input),
						new ExpectedConstraintError('s.string.uuid', 'Invalid string format', input, 'expected to match UUIDv4')
					);
				});

				describe('Default behavior', () => {
					const defaultPredicate = s.string.uuid();
					test('GIVEN v4 UUID THEN return the input', () => {
						expect(uuid4Predicate.parse(uuid4)).toStrictEqual(defaultPredicate.parse(uuid4));
					});

					test.each([uuid1, ...invalidUuids])('GIVEN UUID other than v4 THEN throws a ConstraintError', (input) => {
						expectError(
							() => defaultPredicate.parse(input),
							new ExpectedConstraintError('s.string.uuid', 'Invalid string format', input, 'expected to match UUIDv4')
						);
					});
				});
			});

			describe('uuid3', () => {
				const uuid3Predicate = s.string.uuid({ version: 3 });

				test.each([uuid3])('GIVEN %p THEN returns given value', (input) => {
					expect(uuid3Predicate.parse(input)).toBe(input);
				});

				test.each([...invalidUuids, uuid4, uuid5])('GIVEN %p THEN throws a ConstraintError', (input) => {
					expectError(
						() => uuid3Predicate.parse(input),
						new ExpectedConstraintError('s.string.uuid', 'Invalid string format', input, 'expected to match UUIDv3')
					);
				});
			});

			describe('with version range', () => {
				const uuidRangePredicate = s.string.uuid({ version: '1-4' });

				test.each([uuid1, uuid3, uuid3])('GIVEN %p THEN returns given value', (input) => {
					expect(uuidRangePredicate.parse(input)).toBe(input);
				});

				test.each([uuid5, nullUuid])('GIVEN %p THEN throws a ConstraintError', (input) => {
					expectError(
						() => uuidRangePredicate.parse(input),
						new ExpectedConstraintError('s.string.uuid', 'Invalid string format', input, `expected to match UUID in range of 1-4`)
					);
				});
			});

			describe('Nullable', () => {
				test('GIVEN null UUID THEN returns null UUID', () => {
					const uuidPredicate = s.string.uuid({ version: '1-5', nullable: true });
					expect(uuidPredicate.parse(nullUuid)).toBe(nullUuid);
				});
			});
		});

		describe('regex', () => {
			const regex = /^[a-z]+$/;
			const regexPredicate = s.string.regex(regex);

			test.each(['abc', 'xyz'])('GIVEN %p THEN returns given value', (input) => {
				expect(regexPredicate.parse(input)).toBe(input);
			});

			test.each(['ABC', '123A'])('GIVEN %p THEN throws a ConstraintError', (input) => {
				expectError(
					() => regexPredicate.parse(input),
					new ExpectedConstraintError('s.string.regex', 'Invalid string format', input, `expected ${regex}.test(expected) to be true`)
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

				test.each([...v4Ips, ...v6Ips])('GIVEN %p THEN returns given value', (input) => {
					expect(ipPredicate.parse(input)).toBe(input);
				});

				test.each(invalidIps)('GIVEN %p THEN throws a ConstraintError', (input) => {
					expectError(
						() => ipPredicate.parse(input),
						new ExpectedConstraintError('s.string.ip', 'Invalid IP address', input, 'expected to be an IP address')
					);
				});
			});

			describe('v4', () => {
				const ipv4Predicate = s.string.ipv4;

				test.each(v4Ips)('GIVEN %p THEN returns given value', (input) => {
					expect(ipv4Predicate.parse(input)).toBe(input);
				});

				test.each([...v6Ips, ...invalidIps])('GIVEN %p THEN throws a ConstraintError', (input) => {
					expectError(
						() => ipv4Predicate.parse(input),
						new ExpectedConstraintError('s.string.ipv4', 'Invalid IPv4 address', input, 'expected to be an IPv4 address')
					);
				});
			});

			describe('v6', () => {
				const ipv6Predicate = s.string.ipv6;

				test.each(v6Ips)('GIVEN %p THEN returns given value', (input) => {
					expect(ipv6Predicate.parse(input)).toBe(input);
				});

				test.each([...v4Ips, ...invalidIps])('GIVEN %p THEN throws a ConstraintError', (input) => {
					expectError(
						() => ipv6Predicate.parse(input),
						new ExpectedConstraintError('s.string.ipv6', 'Invalid IPv6 address', input, 'expected to be an IPv6 address')
					);
				});
			});
		});
	});
});
