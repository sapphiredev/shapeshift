import sapphireEslintConfig from '@sapphire/eslint-config';

export default [
	...sapphireEslintConfig,
	{
		ignores: ['dist/**']
	},
	{
		files: ['src/index.ts'],
		rules: {
			'id-length': ['error', { exceptions: ['s'] }]
		}
	},
	{
		files: ['src/validators/UnionValidator.ts'],
		rules: {
			// Optional and nullable unions widen T and do not preserve subclasses.
			'@typescript-eslint/prefer-return-this-type': 'off'
		}
	},
	{
		files: ['tests/**/*.ts'],
		rules: {
			'@typescript-eslint/dot-notation': 'off'
		}
	},
	{
		files: ['tests/unit/validators/object.test.ts'],
		rules: {
			// The conditional validation API uses `then`, not Promise assimilation.
			'unicorn/no-thenable': 'off'
		}
	}
];
