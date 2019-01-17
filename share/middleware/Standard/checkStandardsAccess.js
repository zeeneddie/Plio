import checkDocsAccess from '../Document/checkDocsAccess';
import branch from '../helpers/branch';

export default () => branch(
  (root, args) => args.standardsIds,
  checkDocsAccess((root, { standardsIds }, context) => ({
    ids: standardsIds,
    collection: context.collections.Standards,
  })),
);
