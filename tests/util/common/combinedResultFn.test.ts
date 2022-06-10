import { combinedErrorFn } from '../../../src/constraints/util/common/combinedResultFn';

describe('combinedErrorFn', () => {
	describe('0 functions', () => {
		test('GIVEN no functions THEN always returns null', () => {
			const fn = combinedErrorFn();
			expect(fn()).toBe(null);
		});
	});

	describe('1 function', () => {
		test('GIVEN one function returning null THEN returns null', () => {
			const cb = vi.fn().mockReturnValue(null);
			const fn = combinedErrorFn(cb);

			expect(fn('foo', 'bar')).toBe(null);

			expect(cb).toBeCalledTimes(1);
			expect(cb).toHaveBeenCalledWith('foo', 'bar');
		});

		test('GIVEN one function returning error THEN returns the same error', () => {
			const error = new Error('my precious');
			const cb = vi.fn().mockReturnValue(error);
			const fn = combinedErrorFn(cb);

			expect(fn('foo', 'bar')).toBe(error);

			expect(cb).toBeCalledTimes(1);
			expect(cb).toHaveBeenCalledWith('foo', 'bar');
		});
	});

	describe('2 functions', () => {
		test('GIVEN (null, null) THEN returns null', () => {
			const cb0 = vi.fn().mockReturnValue(null);
			const cb1 = vi.fn().mockReturnValue(null);
			const fn = combinedErrorFn(cb0, cb1);

			expect(fn('foo', 'bar')).toBe(null);

			expect(cb0).toBeCalledTimes(1);
			expect(cb0).toHaveBeenCalledWith('foo', 'bar');

			expect(cb1).toBeCalledTimes(1);
			expect(cb1).toHaveBeenCalledWith('foo', 'bar');
		});

		test('GIVEN (null, error) THEN returns error', () => {
			const error = new Error('not all those who wander are lost');
			const cb0 = vi.fn().mockReturnValue(null);
			const cb1 = vi.fn().mockReturnValue(error);
			const fn = combinedErrorFn(cb0, cb1);

			expect(fn('foo', 'bar')).toBe(error);

			expect(cb0).toBeCalledTimes(1);
			expect(cb0).toHaveBeenCalledWith('foo', 'bar');

			expect(cb1).toBeCalledTimes(1);
			expect(cb1).toHaveBeenCalledWith('foo', 'bar');
		});

		test('GIVEN (error, null) THEN returns error', () => {
			const error = new Error('it is a dangerous business');
			const cb0 = vi.fn().mockReturnValue(error);
			const cb1 = vi.fn().mockReturnValue(null);
			const fn = combinedErrorFn(cb0, cb1);

			expect(fn('foo', 'bar')).toBe(error);

			expect(cb0).toBeCalledTimes(1);
			expect(cb0).toHaveBeenCalledWith('foo', 'bar');

			expect(cb1).not.toHaveBeenCalled();
		});
	});

	describe('3 functions', () => {
		test('GIVEN (null, null, null) THEN returns null', () => {
			const cb0 = vi.fn().mockReturnValue(null);
			const cb1 = vi.fn().mockReturnValue(null);
			const cb2 = vi.fn().mockReturnValue(null);
			const fn = combinedErrorFn(cb0, cb1, cb2);

			expect(fn('foo', 'bar')).toBe(null);

			expect(cb0).toBeCalledTimes(1);
			expect(cb0).toHaveBeenCalledWith('foo', 'bar');

			expect(cb1).toBeCalledTimes(1);
			expect(cb1).toHaveBeenCalledWith('foo', 'bar');

			expect(cb2).toBeCalledTimes(1);
			expect(cb2).toHaveBeenCalledWith('foo', 'bar');
		});

		test('GIVEN (null, error, null) THEN returns error', () => {
			const error = new Error('go where you must go, and hope!');
			const cb0 = vi.fn().mockReturnValue(null);
			const cb1 = vi.fn().mockReturnValue(error);
			const cb2 = vi.fn().mockReturnValue(null);
			const fn = combinedErrorFn(cb0, cb1, cb2);

			expect(fn('foo', 'bar')).toBe(error);

			expect(cb0).toBeCalledTimes(1);
			expect(cb0).toHaveBeenCalledWith('foo', 'bar');

			expect(cb1).toBeCalledTimes(1);
			expect(cb1).toHaveBeenCalledWith('foo', 'bar');

			expect(cb2).not.toHaveBeenCalled();
		});

		test('GIVEN (error, null, null) THEN returns error', () => {
			const error = new Error('all is well that ends better');
			const cb0 = vi.fn().mockReturnValue(error);
			const cb1 = vi.fn().mockReturnValue(null);
			const cb2 = vi.fn().mockReturnValue(null);
			const fn = combinedErrorFn(cb0, cb1, cb2);

			expect(fn('foo', 'bar')).toBe(error);

			expect(cb0).toBeCalledTimes(1);
			expect(cb0).toHaveBeenCalledWith('foo', 'bar');

			expect(cb1).not.toHaveBeenCalled();
			expect(cb2).not.toHaveBeenCalled();
		});
	});
});
