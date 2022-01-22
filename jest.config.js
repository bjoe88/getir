const {
  defaults,
} = require('jest-config');

module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },

  collectCoverage: false,
  collectCoverageFrom: ['**/*.ts', '!**/tests/**', '!**/node_modules/**', '!**/coverage/**'],
  coveragePathIgnorePatterns: [],
  coverageThreshold: {},
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.env.ts'],
  reporters: ['default'],
  verbose: true,
};
