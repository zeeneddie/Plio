export default () => async (next, root, args, context) => {
  const { collections: { Departments } } = context;
  const _id = await next(root, args, context);
  const department = Departments.findOne({ _id });
  return { department };
};
