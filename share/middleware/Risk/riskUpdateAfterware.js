export default (config = () => ({})) => async (next, root, args, context) => {
  let { _id } = await config(root, args, context);
  const { collections: { Risks } } = context;

  if (!_id) ({ _id } = args);

  await next(root, args, context);

  return Risks.findOne({ _id });
};
