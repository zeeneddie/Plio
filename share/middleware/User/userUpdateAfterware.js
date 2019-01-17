export default (config = () => ({})) => async (next, root, args, context) => {
  let { _id } = await config(root, args, context);
  const { collections: { Users } } = context;

  if (!_id) ({ _id } = args);

  await next(root, args, context);

  const user = await Users.findOne({ _id });

  return { user };
};
