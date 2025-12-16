import eslintPluginNext from '@next/eslint-plugin-next'

import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  /* ---------------------------------------------------------------------- */
  /*                          I G N O R E   P A T H S                       */
  /* ---------------------------------------------------------------------- */
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/out/**',
      '**/public/**',

      // blockchain artifacts
      '**/artifacts/**',
      '**/typechain-types/**',
      '**/contracts/**',
      '**/cache/**',

      // convex generated files
      '**/convex/_generated/**',

      // meta folders
      '**/.git/**',
      '**/.vscode/**',
      '**/.idea/**',
      '**/.husky/**',
      '**/.vercel/**',
      '**/.turbo/**',
      '**/.output/**',
      '**/.cache/**',
      '**/.DS_Store'
    ]
  },

  /* ---------------------------------------------------------------------- */
  /*                       N E X T . J S  P L U G I N                       */
  /* ---------------------------------------------------------------------- */
  {
    plugins: {
      '@next/next': eslintPluginNext
    },
    rules: {
      ...eslintPluginNext.configs['core-web-vitals'].rules
    }
  },

  /* ---------------------------------------------------------------------- */
  /*                         P R E T T I E R   O V E R R I D E              */
  /* ---------------------------------------------------------------------- */
  eslintConfigPrettier,

  /* ---------------------------------------------------------------------- */
  /*                         T Y P E S C R I P T   R U L E S                */
  /* ---------------------------------------------------------------------- */
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'unused-imports': unusedImports,
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
      '@next/next': eslintPluginNext,
      'react-hooks': reactHooks
    },

    rules: {
      /* ---------- Unused imports / vars ---------- */
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_'
        }
      ],

      /* ---------- Import ordering ---------- */
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index']
          ],
          pathGroups: [
            {
              pattern: '{react,next/**,@next/**}',
              group: 'external',
              position: 'before'
            },
            {
              pattern: '{@/components/**,@/hooks/**,@/lib/**,@/blockchain/**,@/**}',
              group: 'internal',
              position: 'after'
            }
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always'
        }
      ],

      /* ---------- TypeScript ---------- */
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_'
        }
      ],

      /* ---------- React Hooks ---------- */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /* ---------- Prettier ---------- */
      'prettier/prettier': 'warn'
    }
  }
]
