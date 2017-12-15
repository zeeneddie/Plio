export const _ = {
  values: jest.fn(() => []),
  keys: jest.fn(() => []),
  isEqual: jest.fn(),
  first: jest.fn(),
  contains: jest.fn(() => true),
};
