import type {
	ArrayConstraintName,
	BigIntConstraintName,
	BooleanConstraintName,
	DateConstraintName,
	NumberConstraintName,
	ObjectConstraintName,
	StringConstraintName,
	TypedArrayConstraintName
} from '../../constraints/type-exports';
import { BaseError } from './BaseError';
import type { BaseConstraintErrorJsonified } from './error-types';

export type ConstraintErrorNames =
	| TypedArrayConstraintName
	| ArrayConstraintName
	| BigIntConstraintName
	| BooleanConstraintName
	| DateConstraintName
	| NumberConstraintName
	| ObjectConstraintName
	| StringConstraintName;

export abstract class BaseConstraintError<T = unknown> extends BaseError {
	public readonly constraint: ConstraintErrorNames;
	public readonly given: T;

	public constructor(constraint: ConstraintErrorNames, message: string, given: T) {
		super(message);
		this.constraint = constraint;
		this.given = given;
	}

	public override toJSON(): BaseConstraintErrorJsonified<T> {
		return {
			name: this.name,
			constraint: this.constraint,
			given: this.given,
			message: this.message
		};
	}
}
