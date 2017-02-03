import curry from 'lodash.curry';

// note that you need to pass payload or otherwise function will return itself
// curry(type)() => (payload) =>
export const createAction = curry((type, payload) => ({ type, payload }));
