export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Departments } } = context;

  await next(root, args, context);

  return Departments.findOne({ _id });
};
