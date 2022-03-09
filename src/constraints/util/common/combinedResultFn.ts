export function combinedErrorFn<P extends [...any], E extends Error>(...fns: ErrorFn<P, E>[]): ErrorFn<P, E> {
	switch (fns.length) {
		case 0:
			return () => null;
		case 1:
			return fns[0];
		case 2: {
			const [fn0, fn1] = fns;
			return (...params) => fn0(...params) && fn1(...params);
		}
		case 3: {
			const [fn0, fn1, fn2] = fns;
			return (...params) => fn0(...params) && fn1(...params) && fn2(...params);
		}
		default: {
			// We offer optimization up to 3 functions, so we will make a combined result function for the first three
			// functions and then combined it with the rest using recursion.
			const [fn0, fn1, fn2, ...restFn] = fns;
			return combinedErrorFn(combinedErrorFn(fn0, fn1, fn2), ...restFn);
		}
	}
}

export type ErrorFn<P extends [...any], E extends Error> = (...params: P) => E | null;
