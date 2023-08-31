/**
 * @vitest-environment jsdom
 */

import { type DOMWindow, JSDOM } from 'jsdom';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

describe('browser-bundle-test', () => {
	let window: DOMWindow;

	beforeAll(async () => {
		window = new JSDOM(
			`
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta http-equiv="X-UA-Compatible" content="IE=edge">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>BrowserBundleTest</title>
					<script>${await readFile(join(__dirname, '../../dist/index.global.js'), 'utf8')}</script>
				</head>
				<body></body>
				</html>
		`,
			{
				runScripts: 'dangerously'
			}
		).window;
	});

	test('GIVEN an unique array THEN return the given value', () => {
		expect(window.SapphireShapeshift.s.string().parse('Hello')).toBe('Hello');
	});
});

declare global {
	interface Window {
		SapphireShapeshift: typeof import('../../src');
	}
}
