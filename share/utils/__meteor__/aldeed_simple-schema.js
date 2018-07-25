const SimpleSchema = jest.fn();
SimpleSchema.extendOptions = jest.fn();
SimpleSchema.messages = jest.fn();
SimpleSchema.prototype.messages = jest.fn();
SimpleSchema.prototype.validator = jest.fn();
SimpleSchema.prototype.pick = jest.fn();
SimpleSchema.RegEx = {
  Id: jest.fn(),
};
SimpleSchema.prototype.schema = jest.fn();

module.exports = { SimpleSchema };
