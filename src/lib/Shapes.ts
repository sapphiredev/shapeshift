import type { BaseValidator } from '../validators/BaseValidator';
import { NumberValidator } from '../validators/NumberValidator';
import { StringValidator } from '../validators/StringValidator';
import { UnionValidator } from '../validators/UnionValidator';

export class Shapes {
	public get string() {
		return new StringValidator();
	}

	public get number() {
		return new NumberValidator();
	}

	public union<T>(...validators: readonly BaseValidator<T>[]) {
		return new UnionValidator([], validators);
	}
}
