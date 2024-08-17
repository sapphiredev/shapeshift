import { s } from '../../../src';

describe.each(['custom message', undefined])('AnyValidator (%s)', (message) => {
	const predicate = s.any({ message });

	test.each([1, 'hello', null])('GIVEN anything (%j) THEN returns the given value', (input) => {
		expect<any>(predicate.parse(input)).toBe(input);
	});
});

describe('UnknownValidator', () => {
	const predicate = s.unknown();

	test.each([1, 'hello', null])('GIVEN anything (%j) THEN returns the given value', (input) => {
		expect<unknown>(predicate.parse(input)).toBe(input);
	});
});
