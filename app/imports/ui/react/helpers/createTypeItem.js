import curry from 'lodash.curry';

export const createTypeItem = curry((type, key) => ({
  key,
  type,
}));
