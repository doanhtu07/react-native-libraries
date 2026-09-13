// https://docs.expo.dev/guides/using-eslint/

import { globalIgnores } from 'eslint/config'
import prettier from 'eslint-plugin-prettier'
import * as espree from 'espree'

export default [
  globalIgnores([
    'eslint.config.js',
    'babel.config.js',
    'prettier.config.js',
    'app.json',
    'dist',
  ]),

  // Expo plugins
  {
    files: ['./plugins/**/*.js'],
    languageOptions: {
      // Override parser @babel/eslint-parser from reactNativeConfig, which causes issues with eslint v10
      parser: espree,
      parserOptions: {
        requireConfigFile: false,
      },
    },
  },

  // Prettier
  {
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
]
