module.exports = {
  server: {
    command: 'NODE_ENV=test yarn --cwd app start --port 1337',
    launchTimeout: 600000,
    port: 1337,
    debug: true,
  },
  launch: {
    headless: true,
    timeout: 0,
  },
};
