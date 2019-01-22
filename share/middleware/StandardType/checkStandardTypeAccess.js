import checkDocAccess from '../Document/checkDocAccess';
import branch from '../helpers/branch';

export default () => branch(
  (root, args) => args.typeId,
  checkDocAccess(async (root, { typeId }, context) => ({
    query: { _id: typeId },
    collection: context.collections.StandardTypes,
  })),
);
