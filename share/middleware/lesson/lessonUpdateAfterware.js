export default (getId = (root, args) => args._id) => async (next, root, args, context) => {
  const _id = getId(root, args, context);
  const { collections: { LessonsLearned } } = context;

  await next(root, args, context);

  const lesson = await LessonsLearned.findOne({ _id });

  return { lesson };
};
