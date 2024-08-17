import { render } from '@testing-library/vue';
import { expect, test } from 'vitest';
import Shapeshift from './shapeshift.vue';

describe('Browser bundle test', () => {
	test('GIVEN an unique array THEN return the given value', () => {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		const { getByTestId } = render(Shapeshift);
		const element = getByTestId('text-element');
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent('Hello');
	});
});
