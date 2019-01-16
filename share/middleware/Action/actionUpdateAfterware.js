export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Actions } } = context;

  await next(root, args, context);

  const action = await Actions.findOne({ _id });

  return { action };
};
