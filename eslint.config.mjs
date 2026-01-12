// @ts-check
import antfu from '@antfu/eslint-config';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  antfu(
    {
      type: 'app',
      vue: true,
      typescript: true,
      ignores: [
        '**/.github/workflows/**',
        '**/migrations/*',
      ],
      formatters: true,
      stylistic: {
        indent: 2,
        semi: true,
        quotes: 'single',
      },
    },
    {
      rules: {
        'ts/consistent-type-definitions': ['error', 'type'],
        'no-console': ['warn'],
        'antfu/no-top-level-await': ['off'],
        'node/prefer-global/process': ['off'],
        'node/no-process-env': ['error'],
        'perfectionist/sort-imports': [
          'error',
          {
            tsconfigRootDir: '.',
          },
        ],
        'unicorn/filename-case': [
          'error',
          {
            case: 'camelCase',
            ignore: ['README.md'],
          },
        ],
      },
    },
  ),
);
