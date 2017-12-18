module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  modulePaths: [
    '<rootDir>/../node_modules/',
    '<rootDir>/../app/node_modules',
  ],
  moduleNameMapper: {
    '^meteor/(.*):(.*)$': '<rootDir>/utils/__meteor__/$1_$2',
    '^meteor/': '<rootDir>/utils/__meteor__',
  },
  unmockedModulePathPatterns: [
    '/^imports\\/.*\\.jsx?$/',
    '/^node_modules/',
  ],
};
