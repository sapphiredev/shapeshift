/**
 * @vitest-environment happy-dom
 */

import type { IWindow } from 'happy-dom';

declare global {
	interface Window extends IWindow {
		SapphireShapeshift: typeof import('../src');
	}
	namespace JSX {
		interface Element {
			outerHTML: string;
		}
	}
}

describe('bundle-test', () => {
	beforeEach(() => {
		const scriptTag = document.createElement('script');
		scriptTag.src = '../dist/index.global.js';
		document.head.appendChild(scriptTag);
	});

	test('GIVEN an unique array THEN return the given value', () => {
		expect(window.SapphireShapeshift.s.string.array.unique.parse(['a', 'b', 'c'])).toStrictEqual(['a', 'b', 'c']);
	});
});
