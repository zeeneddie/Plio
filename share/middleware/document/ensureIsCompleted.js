import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  if (!context.doc.isCompleted) {
    throw new Error(Errors.DOC_SHOULD_BE_COMPLETED);
  }

  return next(root, args, context);
};
