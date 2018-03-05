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
  const data = store.readFragment(args);

  store.writeFragment({
    ...args,
    data: getNewData(data),
  });
});
