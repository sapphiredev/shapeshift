/**
 * @vitest-environment happy-dom
 */

import { Window } from 'happy-dom';

describe('bundle-test', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
		const { document } = window;

		document.write(`
				<html>
					<head>
						<title>Test page</title>
					</head>
					<body>
						<script src="../dist/index.global.js"/>
					</body>
				</html>
		`);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test('GIVEN an unique array THEN return the given value', () => {
		expect(window.SapphireShapeshift.s.string.array.unique.parse(['a', 'b', 'c'])).toStrictEqual(['a', 'b', 'c']);
	});
});

declare module 'happy-dom' {
	interface Window {
		SapphireShapeshift: typeof import('../src');
	}
}
