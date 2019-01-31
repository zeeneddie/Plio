const Accounts = {
  addEmail: jest.fn(),
  createUser: jest.fn(),
  sendVerificationEmail: jest.fn(),
  _storedLoginToken: jest.fn(),
};

module.exports = {
  Accounts,
};
