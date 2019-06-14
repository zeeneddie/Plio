module.exports = {
  server: [
    {
      command: 'yarn --cwd app start:test',
      launchTimeout: 180000,
      port: 1337,
      debug: true,
    },
    {
      command: 'yarn --cwd background-app start:test',
      launchTimeout: 60000,
      port: 4337,
      debug: true,
    },
    {
      command: 'yarn --cwd graphql-server start:test',
      launchTimeout: 60000,
      port: 5337,
      debug: true,
    },
  ],
  launch: {
    headless: true,
    timeout: 0,
  },
};
