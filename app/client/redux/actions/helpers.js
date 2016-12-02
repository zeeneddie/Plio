import curry from 'lodash.curry';

export const createAction = curry((type, payload) => ({ type, payload }));
