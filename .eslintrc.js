module.exports = {
  root: true,
  extends: ['react-app', 'react-app/jest', 'next/core-web-vitals'],
  ignorePatterns: ['public/', '*.html'],
  plugins: ['import-helpers', 'prettier'],
  rules: {
    'import/no-anonymous-default-export': 'off',
    'import-helpers/order-imports': [
      'warn',
      {
        alphabetize: {
          order: 'asc',
          ignoreCase: true,
        },
        groups: ['module', '/^~//', ['parent', 'sibling', 'index']],
        newlinesBetween: 'always',
      },
    ],
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        printWidth: 80,
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    'react/jsx-curly-brace-presence': [
      'warn',
      {
        props: 'never',
        children: 'never',
        propElementValues: 'always',
      },
    ],
    'testing-library/prefer-screen-queries': 'off',
  },
};
