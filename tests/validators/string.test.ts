import { ExpectedConstraintError, MultiplePossibilitiesConstraintError, s, ValidationError } from '../../src';
import { expectError } from '../common/macros/comparators';

describe('StringValidator', () => {
	const predicate = s.string;

	test('GIVEN a string THEN returns a string', () => {
		expect(predicate.parse('Hello There')).toBe('Hello There');
	});

	test.each([undefined, null, 42])('GIVEN %j THEN throws a ValidationError', (input) => {
		expectError(() => predicate.parse(input), new ValidationError('s.string', 'Expected a string primitive', input));
	});

	describe('Comparators', () => {
		describe('lengthLessThan', () => {
			const lengthLessThanPredicate = s.string.lengthLessThan(5);

			test.each(['Hi'])('GIVEN %j THEN returns given value', (input) => {
				expect(lengthLessThanPredicate.parse(input)).toBe(input);
			});

			test.each(['Hello', 'Foo Bar'])('GIVEN %j THEN throws a ConstraintError', (input) => {
				expectError(
					() => lengthLessThanPredicate.parse(input),
					new ExpectedConstraintError('s.string.lengthLessThan', 'Invalid string length', input, 'expected.length < 5')
				);
			});
		});

		describe('lengthLessThanOrEqual', () => {
			const lengthLePredicate = s.string.lengthLessThanOrEqual(5);

			test.each(['Hi', 'Hello'])('GIVEN %j THEN returns given value', (input) => {
				expect(lengthLePredicate.parse(input)).toBe(input);
			});

			test.each(['Foo Bar'])('GIVEN %j THEN throws a ConstraintError', (input) => {
				expectError(
					() => lengthLePredicate.parse(input),
					new ExpectedConstraintError('s.string.lengthLessThanOrEqual', 'Invalid string length', input, 'expected.length <= 5')
				);
			});
		});

		describe('lengthGreaterThan', () => {
			const lengthGtPredicate = s.string.lengthGreaterThan(5);

			test.each(['Foo Bar'])('GIVEN %j THEN returns given value', (input) => {
				expect(lengthGtPredicate.parse(input)).toBe(input);
			});

			test.each(['Hi', 'Hello'])('GIVEN %j THEN throws a ConstraintError', (input) => {
				expectError(
					() => lengthGtPredicate.parse(input),
					new ExpectedConstraintError('s.string.lengthGreaterThan', 'Invalid string length', input, 'expected.length > 5')
				);
			});
		});

		describe('lengthGreaterThanOrEqual', () => {
			const lengthGePredicate = s.string.lengthGreaterThanOrEqual(5);

			test.each(['Hello', 'Foo Bar'])('GIVEN %j THEN returns given value', (input) => {
				expect(lengthGePredicate.parse(input)).toBe(input);
			});

			test.each(['Hi'])('GIVEN %j THEN throws a ConstraintError', (input) => {
				expectError(
					() => lengthGePredicate.parse(input),
					new ExpectedConstraintError('s.string.lengthGreaterThanOrEqual', 'Invalid string length', input, 'expected.length >= 5')
				);
			});
		});

		describe('lengthEqual', () => {
			const lengthEqPredicate = s.string.lengthEqual(5);

			test.each(['Hello'])('GIVEN %j THEN returns given value', (input) => {
				expect(lengthEqPredicate.parse(input)).toBe(input);
			});

			test.each(['Hi', 'Foo Bar'])('GIVEN %j THEN throws a ConstraintError', (input) => {
				expectError(
					() => lengthEqPredicate.parse(input),
					new ExpectedConstraintError('s.string.lengthEqual', 'Invalid string length', input, 'expected.length === 5')
				);
			});
		});

		describe('lengthNotEqual', () => {
			const lengthNePredicate = s.string.lengthNotEqual(5);

			test.each(['Hi', 'Foo Bar'])('GIVEN %j THEN returns given value', (input) => {
				expect(lengthNePredicate.parse(input)).toBe(input);
			});

			test.each(['Hello'])('GIVEN %j THEN throws a ConstraintError', (input) => {
				expectError(
					() => lengthNePredicate.parse(input),
					new ExpectedConstraintError('s.string.lengthNotEqual', 'Invalid string length', input, 'expected.length !== 5')
				);
			});
		});
	});

	describe('Formats', () => {
		describe('email', () => {
			const emailPredicate = s.string.email;

			test.each(['hi@hello.com', 'foo@bar.net', 'hello+world@example.com'])('GIVEN %j THEN returns given value', (input) => {
				expect(emailPredicate.parse(input)).toBe(input);
			});

			test.each([
				'hi@hello',
				'foo@bar',
				'foo@bar.com/',
				'foo@bar.com/index?search=ok',
				'foo@[object Object].com',
				'',
				'without-at-sign',
				'with@multiple-@-signs',
				"skywalker@did-you-ever-hear-the-tragedy-of-Darth-Plagueis-The-Wise?-I-thought-not.-It's-not-a-story-the-Jedi-would-tell-you.-It's-a-Sith-legend.-Darth-Plagueis-was-a-Dark-Lord-of-the-Sith,-so-powerful-and-so-wise-he-could-use-the-Force-to-influence-the-midichlorians-to-create-life…-He-had-such-a-knowledge-of-the-dark-side-that-he-could-even-keep-the-ones-he-cared-about-from-dying.-The-dark-side-of-the-Force-is-a-pathway-to-many-abilities-some-consider-to-be-unnatural.-He-became-so-powerful…-the-only-thing-he-was-afraid-of-was-losing-his-power,-which-eventually,-of-course,-he-did.-Unfortunately,-he-taught-his-apprentice-everything-he-knew,-then-his-apprentice-killed-him-in-his-sleep.-Ironic.-He-could-save-others-from-death,-but-not-himself.com",
				'When-you-look-at-the-dark-side,-careful-you-must-be.-For-the-dark-side-looks-back@master-yoda-swamp.com',
				'short-account-name@domain-name-that-has-more-than-sixty-three-characters-and-is-then.followed-by-another-segment-that-got-split-by-a-full-stop-symbol.com',
				`foo@bar.${'a'.repeat(64)}`
			])('GIVEN %j THEN throws a ConstraintError', (input) => {
				expectError(
					() => emailPredicate.parse(input),
					new ExpectedConstraintError('s.string.email', 'Invalid email address', input, 'expected to be an email address')
				);
			});
		});

		describe('url', () => {
			describe('Without any options', () => {
				const urlPredicate = s.string.url();

				test.each(['https://google.com', 'http://foo.bar'])('GIVEN %j THEN returns given value', (input) => {
					expect(urlPredicate.parse(input)).toBe(input);
				});

				test.each(['google.com', 'foo.bar'])('GIVEN %j THEN throws a ConstraintError', (input) => {
					expectError(
						() => urlPredicate.parse(input),
						new ExpectedConstraintError('s.string.url', 'Invalid URL', input, 'expected to match an URL')
					);
				});
			});

			describe('With protocol', () => {
				const urlPredicateWithProtocol = s.string.url({ allowedProtocols: ['git:'] });

				test.each(['git://foo.bar'])('GIVEN %j THEN returns given value', (input) => {
					expect(urlPredicateWithProtocol.parse(input)).toBe(input);
				});

				test.each(['https://google.com', 'http://foo.bar'])('GIVEN %j THEN throws a ConstraintError', (input) => {
					expectError(
						() => urlPredicateWithProtocol.parse(input),
						new MultiplePossibilitiesConstraintError('s.string.url', 'Invalid URL protocol', input, ['git:'])
					);
				});
			});

			describe('With domain', () => {
				const urlPredicateWithDomain = s.string.url({ allowedDomains: ['google.com'] });

				test.each(['https://google.com', 'http://google.com'])('GIVEN %j THEN returns given value', (input) => {
					expect(urlPredicateWithDomain.parse(input)).toBe(input);
				});

				test.each(['https://foo.bar', 'http://foo.bar'])('GIVEN %j THEN throws a ConstraintError', (input) => {
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

				test.each(['https://google.com', 'https://example.org'])('GIVEN %j THEN returns given value', (input) => {
					expect(urlPredicateWithDomainAndProtocol.parse(input)).toBe(input);
				});

				test.each(['http://example.org', 'git://example.org'])('GIVEN %j THEN throws a ConstraintError', (input) => {
					expectError(
						() => urlPredicateWithDomainAndProtocol.parse(input),
						new MultiplePossibilitiesConstraintError('s.string.url', 'Invalid URL protocol', input, ['https:'])
					);
				});

				test.each(['https://discord.js.org', 'https://google.es'])('GIVEN %j THEN throws a ConstraintError', (input) => {
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

				test.each([uuid5])('GIVEN %j THEN returns given value', (input) => {
					expect(uuid5Predicate.parse(input)).toBe(input);
				});

				test.each([uuid1, uuid3, uuid4])('GIVEN %j THEN throws a ConstraintError', (input) => {
					expectError(
						() => uuid5Predicate.parse(input),
						new ExpectedConstraintError('s.string.uuid', 'Invalid string format', input, 'expected to match UUIDv5')
					);
				});
			});

			describe('uuid4', () => {
				const uuid4Predicate = s.string.uuid({ version: 4 });

				test.each([uuid4])('GIVEN %j THEN returns given value', (input) => {
					expect(uuid4Predicate.parse(input)).toBe(input);
				});

				test.each([...invalidUuids, uuid5])('GIVEN %j THEN throws a ConstraintError', (input) => {
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

				test.each([uuid3])('GIVEN %j THEN returns given value', (input) => {
					expect(uuid3Predicate.parse(input)).toBe(input);
				});

				test.each([...invalidUuids, uuid4, uuid5])('GIVEN %j THEN throws a ConstraintError', (input) => {
					expectError(
						() => uuid3Predicate.parse(input),
						new ExpectedConstraintError('s.string.uuid', 'Invalid string format', input, 'expected to match UUIDv3')
					);
				});
			});

			describe('with version range', () => {
				const uuidRangePredicate = s.string.uuid({ version: '1-4' });

				test.each([uuid1, uuid3, uuid3])('GIVEN %j THEN returns given value', (input) => {
					expect(uuidRangePredicate.parse(input)).toBe(input);
				});

				test.each([uuid5, nullUuid])('GIVEN %j THEN throws a ConstraintError', (input) => {
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

			test.each(['abc', 'xyz'])('GIVEN %j THEN returns given value', (input) => {
				expect(regexPredicate.parse(input)).toBe(input);
			});

			test.each(['ABC', '123A'])('GIVEN %j THEN throws a ConstraintError', (input) => {
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

				test.each([...v4Ips, ...v6Ips])('GIVEN %j THEN returns given value', (input) => {
					expect(ipPredicate.parse(input)).toBe(input);
				});

				test.each(invalidIps)('GIVEN %j THEN throws a ConstraintError', (input) => {
					expectError(
						() => ipPredicate.parse(input),
						new ExpectedConstraintError('s.string.ip', 'Invalid IP address', input, 'expected to be an IP address')
					);
				});
			});

			describe('v4', () => {
				const ipv4Predicate = s.string.ipv4;

				test.each(v4Ips)('GIVEN %j THEN returns given value', (input) => {
					expect(ipv4Predicate.parse(input)).toBe(input);
				});

				test.each([...v6Ips, ...invalidIps])('GIVEN %j THEN throws a ConstraintError', (input) => {
					expectError(
						() => ipv4Predicate.parse(input),
						new ExpectedConstraintError('s.string.ipv4', 'Invalid IPv4 address', input, 'expected to be an IPv4 address')
					);
				});
			});

			describe('v6', () => {
				const ipv6Predicate = s.string.ipv6;

				test.each(v6Ips)('GIVEN %j THEN returns given value', (input) => {
					expect(ipv6Predicate.parse(input)).toBe(input);
				});

				test.each([...v4Ips, ...invalidIps])('GIVEN %j THEN throws a ConstraintError', (input) => {
					expectError(
						() => ipv6Predicate.parse(input),
						new ExpectedConstraintError('s.string.ipv6', 'Invalid IPv6 address', input, 'expected to be an IPv6 address')
					);
				});
			});
		});
		describe('date', () => {
			const stringDatePredicate = s.string.date;

			test.each([
				'6969-01-01T02:20:00.000Z',
				'1/1/6969, 4:20:00 AM',
				'Sun, 01 Jan 6969 02:20:00 GMT',
				'Sun Jan 01 6969 04:20:00 GMT+0200 (Eastern European Standard Time)'
			])('GIVEN %j THEN returns given value', (input) => {
				expect(stringDatePredicate.parse(input)).toBe(input);
			});

			test('GIVEN invalid date string THEN throws a ConstraintError', () => {
				expectError(
					() => stringDatePredicate.parse('owo'),
					new ExpectedConstraintError(
						's.string.date',
						'Invalid date string',
						'owo',
						'expected to be a valid date string (in the ISO 8601 or ECMA-262 format)'
					)
				);
			});
		});

		describe('phone', () => {
			const phonePredicate = s.string.phone();

			test.each(['+79919542975', '786-307-3615', '+16308520397', '+919367788755', '+916000060091', '9365706789', '936-570-6789'])(
				'GIVEN %j THEN returns given value',
				(input) => {
					expect(phonePredicate.parse(input)).toBe(input);
				}
			);

			test.each(['+1 555-555-5555 ext', '+1 (555) 555-5555', '987-123-4567 x12345', '(123) 456-7890 ext12345'])(
				'GIVEN %j THEN throws a ConstraintError',
				(input) => {
					expectError(
						() => phonePredicate.parse(input),
						new ExpectedConstraintError('s.string.phone', 'Invalid phone number', input, 'expected to be a phone number')
					);
				}
			);
		});
	});
});
