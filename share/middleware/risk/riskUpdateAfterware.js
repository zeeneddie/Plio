export default (getId = (root, args) => args._id) => async (next, root, args, context) => {
  const _id = getId(root, args, context);
  const { collections: { Risks } } = context;

  await next(root, args, context);

  const risk = await Risks.findOne({ _id });

  return { risk };
};
