/**
 * @vitest-environment happy-dom
 */

import type { IWindow } from 'happy-dom';
import path from 'path';

declare global {
	interface Window extends IWindow {
		SapphireShapeshift: typeof import('../../src');
	}
	namespace JSX {
		interface Element {
			outerHTML: string;
		}
	}
}

describe('browser-bundle-test', () => {
	beforeEach(() => {
		const scriptTag = document.createElement('script');
		scriptTag.src = `file:///${path.join(__dirname, '../../dist/index.global.js')}`;
		document.head.appendChild(scriptTag);
	});

	test('GIVEN an unique array THEN return the given value', () => {
		expect(window.SapphireShapeshift.s.string.array.unique.parse(['a', 'b', 'c'])).toStrictEqual(['a', 'b', 'c']);
	});
});
