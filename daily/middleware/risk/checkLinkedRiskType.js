import checkDocAccess from '../document/checkDocAccess';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { typeId } = args;
  const { collections: { RiskTypes } } = context;

  try {
    await checkDocAccess(
      () => RiskTypes,
    )(next, root, { _id: typeId }, context);
  } catch (err) {
    throw new Error(Errors.LINKED_DOC_NOT_FOUND);
  }

  return next(root, args, context);
};
