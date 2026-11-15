import sapphireEslintConfig from '@sapphire/eslint-config';

export default [
	...sapphireEslintConfig,
	{
		ignores: ['dist/**']
	},
	{
		files: ['tests/**/*.ts'],
		rules: {
			'@typescript-eslint/dot-notation': 'off'
		}
	}
];
