import curry from 'lodash.curry';

import { mapByIndex, omitC, findIndexById } from '../../../api/helpers';
import { STORE_COLLECTION_NAMES } from './constants';
import { CollectionNames } from '../../../share/constants';

export const getNormalizedDataKey = prop => `${prop}ByIds`;

export const normalizeObject = ({ _id, ...props }) => ({ [_id]: { _id, ...props } });

export const normalizeArray = (array = []) =>
  array.reduce((prev, cur) => ({ ...prev, ...normalizeObject(cur) }), {});

export const setC = curry((state, action, prop) => {
  const normalizedKey = getNormalizedDataKey(prop);
  return {
    ...state,
    ...action.payload,
    [normalizedKey]: normalizeArray(action.payload[prop]),
  };
});

export const addC = curry((state, action, prop) => {
  const normalizedKey = getNormalizedDataKey(prop);
  return {
    ...state,
    [prop]: state[prop].concat(action.payload),
    [normalizedKey]: { ...state[normalizedKey], ...normalizeObject(action.payload) },
  };
});

export const updateC = curry((state, action, prop) => {
  const index = findIndexById(action.payload._id, state[prop]);
  const normalizedKey = getNormalizedDataKey(prop);
  const { _id, ...props } = action.payload;
  const obj = { [_id]: { ...state[normalizedKey][_id], ...props } };
  return {
    ...state,
    [prop]: mapByIndex(action.payload, index, state[prop]),
    [normalizedKey]: { ...state[normalizedKey], ...obj },
  };
});

export const removeC = curry((state, action, prop) => {
  const index = findIndexById(action.payload, state[prop]);
  const normalizedKey = getNormalizedDataKey(prop);
  return {
    ...state,
    [prop]: state[prop].slice(0, index)
                       .concat(state[prop].slice(index + 1)),
    [normalizedKey]: { ...omitC([action.payload], state[normalizedKey]) },
  };
});

export const setUsersByOrgIds = (state, action) => ({
  ...state,
  [`${STORE_COLLECTION_NAMES[CollectionNames.USERS]}ByOrgIds`]:
    state.organizations.reduce((map, { _id, users }) => ({
      ...map,
      [_id]: users.reduce((prev, { userId, isRemoved }) => {
        const user = { ...state.usersByIds[userId] };

        if (!user || isRemoved) return prev;

        return prev.concat(user);
      }, []),
    }), {}),
});
