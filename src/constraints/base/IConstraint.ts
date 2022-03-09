import type { BaseConstraintError } from '../../lib/errors/BaseConstraintError';
import type { Result } from '../../lib/Result';

export interface IConstraint<Input, Return extends Input = Input> {
	run(input: Input): Result<Return, BaseConstraintError<Input>>;
}
