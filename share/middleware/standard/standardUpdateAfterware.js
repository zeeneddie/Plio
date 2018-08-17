export default (getId = (root, args) => args._id) => async (next, root, args, context) => {
  const _id = getId(root, args, context);
  const { collections: { Standards } } = context;

  await next(root, args, context);

  const standard = await Standards.findOne({ _id });

  return { standard };
};
