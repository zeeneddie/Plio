export default ({ getId = (root, args) => args._id } = {}) => async (next, root, args, context) => {
  const _id = await getId(root, args, context);
  const { collections: { Actions } } = context;

  await next(root, args, context);

  const action = await Actions.findOne({ _id });

  return { action };
};
