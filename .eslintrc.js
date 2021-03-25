module.exports = {
  root: true,
  parserOptions: {
    useJSXTextNode: true,
    project: './tsconfig.test.json',
  },
  env: {
    node: true,
    jest: true,
  },
  extends: ['@distributed/backend'],
  rules: {
    'import/prefer-default-export': 0,
  },
  settings: {
    'import/core-modules': ['pino', '@prisma/client'],
  },
};
