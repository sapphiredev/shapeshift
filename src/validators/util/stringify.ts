export function stringify(value: unknown): string | null | undefined {
	if (Array.isArray(value)) return JSON.stringify(value.map((v) => stringify(v)));
	if (value && typeof value === 'object') return JSON.stringify(value, Object.keys(value).sort());
	return value as string | null | undefined;
}
