import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import next from 'eslint-config-next';

export default tseslint.config(
    {
        name: 'base',
        files: ['**/*.{js,ts,jsx,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: ['./tsconfig.json'],
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'prettier/prettier': 'error',
        },
    },
    next,
    prettier,
);
