import { checkDocAccess } from '../document';
import { branch } from '../helpers';

export default () => branch(
  (root, args) => args.typeId,
  checkDocAccess(async (root, { typeId }, context) => ({
    query: { _id: typeId },
    collection: context.collections.StandardTypes,
  })),
);
