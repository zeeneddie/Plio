import { checkDocsAccess } from '../document';
import { branch } from '../helpers';

export default () => branch(
  (root, args) => args.nonconformityIds,
  checkDocsAccess((root, { nonconformityIds }, context) => ({
    ids: nonconformityIds,
    collection: context.collections.NonConformities,
  })),
);
