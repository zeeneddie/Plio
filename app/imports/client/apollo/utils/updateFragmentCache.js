import { curry } from 'ramda';

export default type => curry((
  getNewData,
  {
    id,
    fragment,
    fragmentName = fragment.fragmentName,
  },
  store,
) => {
  const args = {
    id: `${type}:${id}`,
    fragment,
    fragmentName,
  };

  let data;
  try {
    data = store.readFragment(args);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.warn(err.message);
    return;
  }

  store.writeFragment({
    ...args,
    data: getNewData(data),
  });
});
