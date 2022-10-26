module.exports = {
  ...require('@jupiterone/integration-sdk-dev-tools/config/jest'),
  testMatch: [
    '<rootDir>/src/steps/**/index.test.ts',
    '!**/node_modules/*',
    '!**/dist/*',
    '!**/*.bak/*',
  ],
};
