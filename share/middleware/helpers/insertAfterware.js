export default ({ collection, key }) => async (next, root, args, context) => {
  const { collections: { [collection]: col } } = context;
  const _id = await next(root, args, context);
  const doc = col.findOne({ _id });
  return { [key]: doc };
};
