import { is } from 'ramda';

export default (config, collection) => (dispatch, query, options) => {
  let initializing = true;
  const { added, changed, removed } = is(Function, config) ? config(dispatch) : config;

  const observer = collection.find(query, options).observeChanges({
    added(_id, fields) {
      if (!initializing) {
        added(_id, fields);
      }
    },
    changed,
    removed,
  });

  initializing = false;

  return observer;
};
