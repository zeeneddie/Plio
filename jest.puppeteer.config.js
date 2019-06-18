const config = require('./jest.config.js');

module.exports = {
  ...config,
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['<rootDir>/config/tests/setupTests.e2e.js', 'expect-puppeteer'],
};
