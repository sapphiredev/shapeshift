import { s } from '../../src';

describe('undefined', () => {
	const predicate = s.undefined;

	test('GIVEN undefined should return undefined', () => {
		expect(predicate.parse(undefined)).toBe(undefined);
	});
});
