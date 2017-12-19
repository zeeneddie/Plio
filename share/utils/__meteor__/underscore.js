const methods = {
  values: jest.fn(() => []),
  keys: jest.fn(() => []),
  isEqual: jest.fn(),
  first: jest.fn(),
  contains: jest.fn(() => true),
};

export const _ = Object.assign(jest.fn(() => methods), methods);
