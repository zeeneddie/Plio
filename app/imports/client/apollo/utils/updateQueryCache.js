import { curry } from 'ramda';

export const updateQueryCache = curry((getNewData, queryWithVariables, store) => {
  const data = store.readQuery(queryWithVariables);

  store.writeQuery({
    ...queryWithVariables,
    data: getNewData(data),
  });
});
