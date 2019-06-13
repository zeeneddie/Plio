const config = require('./jest.config.js');

module.exports = {
  ...config,
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: [...config.setupFilesAfterEnv, 'expect-puppeteer'],
};
