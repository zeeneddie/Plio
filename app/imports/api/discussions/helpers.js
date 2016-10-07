import curry from 'lodash.curry';

export const getUserViewedByData = curry((userId, { viewedBy }) =>
  Object.assign([], viewedBy).find(data => Object.is(data.userId, userId)));
