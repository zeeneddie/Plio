const faker = require('faker');

module.exports = {
  Random: {
    id: jest.fn(() => faker.random.uuid()),
  },
};
