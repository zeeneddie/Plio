export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Actions } } = context;

  await next(root, args, context);

  return Actions.findOne({ _id });
};
