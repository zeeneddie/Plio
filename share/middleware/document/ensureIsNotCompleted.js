import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  if (context.doc.isCompleted) {
    throw new Error(Errors.DOC_ALREADY_COMPLETED);
  }

  return next(root, args, context);
};
