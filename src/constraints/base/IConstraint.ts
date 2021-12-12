import type { ConstraintError } from '../../lib/errors/ConstraintError';
import type { Result } from '../../lib/Result';

export interface IConstraint<Input, Return extends Input = Input> {
	run(input: Input): Result<Return, ConstraintError<Input>>;
}
