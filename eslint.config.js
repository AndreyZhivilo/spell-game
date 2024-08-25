import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended, // optional unless you're using "eslint:recommended"
  allConfig: js.configs.all, // optional unless you're using "eslint:all"
});

export default tseslint.config(
  ...compat.extends(
    'airbnb',
    'airbnb/hooks',
    'plugin:prettier/recommended',
    'plugin:react/jsx-runtime'
  ),
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      indent: 'off',
      'consistent-return': 'off',
      'react/react-in-jsx-scope': 'off',
      'linebreak-style': 'off',
      'react/jsx-props-no-spreading': 'off',
      'import/prefer-default-export': 'off',
      'react/require-default-props': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'import/no-extraneous-dependencies': 'off',
      'no-param-reassign': 'off',
      'max-len': 'warn',
      'class-methods-use-this': 'off',
      'react/no-danger': 'off',
      ...reactHooks.configs.recommended.rules,
      'react/jsx-filename-extension': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': 'off',
    },
  }
);
