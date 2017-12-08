module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  modulePaths: [
    '<rootDir>/node_modules/',
    '<rootDir>/node_modules/jest-meteor-stubs/lib/',
  ],
  moduleNameMapper: {
    '^meteor/': '<rootDir>/share/utils/__meteor__',
    '^(.*):(.*)$': '$1_$2',
  },
  unmockedModulePathPatterns: [
    '/^imports\\/.*\\.js?$/',
    '/^node_modules/',
  ],
};
