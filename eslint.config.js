import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

function downgradeRulesToWarnings(rules) {
  if (!rules) return {};
  return Object.entries(rules).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = ['warn', ...value.slice(1)];
    } else {
      acc[key] = 'warn';
    }
    return acc;
  }, {});
}

export default tseslint.config(
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
      ...downgradeRulesToWarnings(js.configs.recommended?.rules),
      ...downgradeRulesToWarnings(tseslint.configs.recommended?.rules),
      ...downgradeRulesToWarnings(reactHooks.configs.recommended?.rules),
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
    },
  }
);
