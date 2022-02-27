import { s } from '../../src';

describe('UndefinedValidator', () => {
	const predicate = s.undefined;

	test('GIVEN undefined THEN returns undefined', () => {
		expect(predicate.parse(undefined)).toBe(undefined);
	});
});
