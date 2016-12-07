import { propEqId } from '/imports/api/helpers';

export const addItem = (state, { collection, item }) => {
  return { ...state, [collection]: state[collection].concat(item) };
};

export const changeItem = (state, { collection, item }) => {
  const index = state[collection].findIndex(propEqId(item._id));

  const newCollection = state[collection]
    .slice(0, index)
    .concat(item)
    .concat(state[collection].slice(index + 1));

  return { ...state, [collection]: newCollection };
};

export const removeItem = (state, { collection, item }) => {
  const index = state[collection].findIndex(propEqId(item._id));

  const newCollection = state[collection]
    .slice(0, index)
    .concat(state[collection].slice(index + 1));

  return { ...state, [collection]: newCollection };
};
