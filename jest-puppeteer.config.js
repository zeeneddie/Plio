module.exports = {
  server: [
    {
      command: 'mongod --port 27017 --dbpath app/.meteor/local/db_test',
      launchTimeout: 10000,
      port: 27017,
    },
    {
      command: 'yarn --cwd app start:test',
      launchTimeout: 180000,
      port: 1337,
    },
    {
      command: 'yarn --cwd background-app start:test',
      launchTimeout: 60000,
      port: 4337,
    },
    {
      command: 'yarn --cwd graphql-server start:test',
      launchTimeout: 60000,
      port: 5337,
    },
  ],
  launch: {
    headless: true,
    timeout: 0,
    dumpio: true,
  },
};
