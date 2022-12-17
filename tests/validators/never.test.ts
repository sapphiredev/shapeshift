import { s, ValidationError } from '../../src';
import { expectError } from '../common/macros/comparators';

describe('NeverValidator', () => {
	const predicate = s.never();

	test.each([123, 'hello'])('GIVEN %j THEN throws ConstraintError', (input) => {
		expectError(() => predicate.parse(input), new ValidationError('s.never()', 'Expected a value to not be passed', input));
	});
});
