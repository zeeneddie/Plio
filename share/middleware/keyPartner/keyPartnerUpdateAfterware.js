export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { KeyPartners } } = context;

  await next(root, args, context);

  return KeyPartners.findOne({ _id });
};
