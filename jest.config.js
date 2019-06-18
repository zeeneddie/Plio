module.exports = {
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '^.+\\.jsx?$': 'babel-jest',
    '.+\\.css$': 'jest-css-modules-transform',
  },
  modulePaths: [
    '<rootDir>/node_modules/',
  ],
  moduleNameMapper: {
    '^meteor/(.*):(.*)$': '<rootDir>/share/utils/__meteor__/$1_$2',
    '^meteor/': '<rootDir>/share/utils/__meteor__',
  },
  unmockedModulePathPatterns: [
    '/^imports\\/.*\\.jsx?$/',
    '/^node_modules/',
  ],
  setupFilesAfterEnv: ['<rootDir>/config/tests/setupTests.js'],
  testURL: 'http://localhost/',
};
