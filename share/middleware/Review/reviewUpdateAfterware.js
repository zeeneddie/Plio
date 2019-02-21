export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Reviews } } = context;

  await next(root, args, context);

  return Reviews.findOne({ _id });
};
