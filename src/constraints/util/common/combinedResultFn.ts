export function combinedErrorFn<P extends [...any], E extends Error>(...fns: ErrorFn<P, E>[]): ErrorFn<P, E> {
	switch (fns.length) {
		case 0:
			return () => null;
		case 1:
			return fns[0];
		case 2: {
			const [fn0, fn1] = fns;
			return (...params) => fn0(...params) || fn1(...params);
		}
		default: {
			return (...params) => {
				for (const fn of fns) {
					const result = fn(...params);
					if (result) return result;
				}

				return null;
			};
		}
	}
}

export type ErrorFn<P extends [...any], E extends Error> = (...params: P) => E | null;
