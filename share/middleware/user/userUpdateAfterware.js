export default ({
  getId = (root, args) => args._id,
}) => async (next, root, args, context) => {
  const _id = await getId(root, args, context);
  const { collections: { Users } } = context;

  await next(root, args, context);

  const user = await Users.findOne({ _id });

  return { user };
};
