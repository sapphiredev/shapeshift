/**
 * @vitest-environment jsdom
 */

import { readFileSync } from 'node:fs';
import { DOMWindow, JSDOM } from 'jsdom';
import path from 'node:path';

const script = readFileSync(path.join(__dirname, '../../dist/index.global.js'), 'utf8');

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
		window = new JSDOM('', {
			runScripts: 'dangerously'
		}).window;

		const { document } = window;

		const scriptTag = document.createElement('script');
		scriptTag.textContent = script;
		document.head.appendChild(scriptTag);
	});

	test('GIVEN an unique array THEN return the given value', () => {
		expect(window.SapphireShapeshift.s.string.parse('Hello')).toBe('Hello');
	});
});
