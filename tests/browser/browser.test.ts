/**
 * @vitest-environment jsdom
 */

import path from 'node:path';
import { DOMWindow, JSDOM } from 'jsdom';

declare global {
	interface Window {
		SapphireShapeshift: typeof import('../../src');
	}
	namespace JSX {
		interface Element {
			outerHTML: string;
		}
	}
}

let window: DOMWindow;

describe('browser-bundle-test', () => {
	beforeEach(() => {
		return new Promise((resolve, reject) => {
			window = new JSDOM('', {
				runScripts: 'dangerously'
			}).window;

			const { document } = window;

			const scriptTag = document.createElement('script');
			scriptTag.src = `file:///${path.join(__dirname, '../../dist/index.global.js')}`;
			document.head.appendChild(scriptTag);
			scriptTag.onload = () => {
				resolve();
			};
			scriptTag.onerror = (e) => {
				reject(e);
			};
		});
	});

	test('GIVEN an unique array THEN return the given value', () => {
		expect(window.SapphireShapeshift.s.string.array.unique.parse(['a', 'b', 'c'])).toStrictEqual(['a', 'b', 'c']);
	});
});
