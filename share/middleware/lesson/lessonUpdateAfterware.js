export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { LessonsLearned } } = context;

  await next(root, args, context);

  return LessonsLearned.findOne({ _id });
};
