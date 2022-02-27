import { s } from '../../src';

describe('NullValidator', () => {
	const predicate = s.null;

	test('GIVEN null should return null', () => {
		expect(predicate.parse(null)).toBe(null);
	});
});
