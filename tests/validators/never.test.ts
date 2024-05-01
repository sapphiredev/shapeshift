import { s, ValidationError } from '../../src';
import { expectError } from '../common/macros/comparators';

describe.each(['custom message', undefined])('NeverValidator (%s)', (message) => {
	const predicate = s.never({ message });

	test.each([123, 'hello'])('GIVEN %j THEN throws ConstraintError', (input) => {
		expectError(() => predicate.parse(input), new ValidationError('s.never()', message ?? 'Expected a value to not be passed', input));
	});
});
