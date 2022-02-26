import { s } from '../../src';

describe('PassThroughValidator', () => {
	const predicate = s.any;

	test.each([1, 'hello', null])('GIVEN anything %s THEN returns the given value', (input) => {
		expect(predicate.parse(input)).toBe(input);
	});
});
