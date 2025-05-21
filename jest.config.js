module.exports = {
  testEnvironment: 'node',
  testTimeout: 15000,
  verbose: true,
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  setupFilesAfterEnv: ['./src/tests/jest.setup.js']
};