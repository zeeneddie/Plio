export default (getId = (root, args) => args._id) => async (next, root, args, context) => {
  const _id = await getId(root, args, context);
  const { collections: { Goals } } = context;

  await next(root, args, context);

  const goal = await Goals.findOne({ _id });

  return { goal };
};
