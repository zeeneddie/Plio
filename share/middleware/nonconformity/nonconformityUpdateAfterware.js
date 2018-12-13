export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { NonConformities } } = context;

  await next(root, args, context);

  return NonConformities.findOne({ _id });
};
