import { checkDocAccess } from '../document';

export default () => async (next, root, args, context) => {
  const { collections: { LessonsLearned } } = context;

  await checkDocAccess(LessonsLearned);

  return next(root, args, context);
};
