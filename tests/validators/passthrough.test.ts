import { s } from '../../src';

describe('AnyValidator', () => {
	const predicate = s.any;

	test.each([1, 'hello', null])('GIVEN anything %s THEN returns the given value', (input) => {
		expect(predicate.parse(input)).toBe(input);
	});
});

describe('unknownValidator', () => {
	const predicate = s.unknown;

	test.each([1, 'hello', null])('GIVEN anything %s THEN returns the given value', (input) => {
		expect(predicate.parse(input)).toBe(input);
	});
});
