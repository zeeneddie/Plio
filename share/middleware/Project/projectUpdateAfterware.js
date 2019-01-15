export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Projects } } = context;

  await next(root, args, context);

  return Projects.findOne({ _id });
};
