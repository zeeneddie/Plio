export default () => async (next, root, args, context) => {
  const { collections: { KeyPartners } } = context;
  const _id = await next(root, args, context);
  const keyPartner = KeyPartners.findOne({ _id });
  return { keyPartner };
};
