import { curry } from 'ramda';

export const updateQueryCache = curry((getNewData, queryWithVariables, store) => {
  let data;

  try {
    data = store.readQuery(queryWithVariables);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.warn(err.message);
    return;
  }

  store.writeQuery({
    ...queryWithVariables,
    data: getNewData(data),
  });
});
