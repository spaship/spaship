module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', 'plugin:react/recommended', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true
    },
    tsconfigRootDir: __dirname
  },
  plugins: ['react', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/prefer-default-export': 'off',
    'prettier/prettier': ['error'],
    'jsx-a11y/anchor-is-valid': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.ts'] }],
    'import/no-extraneous-dependencies': ['error', {'devDependencies': true}],
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function'
      }
    ],
    'react/no-unknown-property': ['error', { ignore: ['jsx'] }]
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  }
};
