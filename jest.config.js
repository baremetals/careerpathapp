/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transform: {
    '<transform_regex>': [
      'ts-jest',
      {
        /* ts-jest config goes here in Jest */
      },
    ],
  },
  testMatch: ['**/**/*.test.ts'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  detectOpenHandles: true,
  // setupFilesAfterEnv: ['./jest.setup.redis-mock.js'],
};
