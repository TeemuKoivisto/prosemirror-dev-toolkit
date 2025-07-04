import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import ts from 'typescript-eslint'
// import next from 'eslint-config-next'
import svelte from 'eslint-plugin-svelte'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

import path from 'path'

/** @type {import('eslint').Linter.Config[]} */
const rules = [
  includeIgnoreFile(path.resolve('.gitignore')),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser
      }
    }
  }
]

export default rules
