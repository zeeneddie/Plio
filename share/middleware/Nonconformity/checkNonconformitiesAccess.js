import checkDocsAccess from '../Document/checkDocsAccess';
import branch from '../helpers/branch';

export default () => branch(
  (root, args) => args.nonconformityIds,
  checkDocsAccess((root, { nonconformityIds }, context) => ({
    ids: nonconformityIds,
    collection: context.collections.NonConformities,
  })),
);
