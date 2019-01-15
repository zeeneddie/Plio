import checkDocsAccess from '../Document/checkDocsAccess';
import branch from '../helpers/branch';

export default () => branch(
  (root, args) => args.projectIds,
  checkDocsAccess((root, { projectIds }, context) => ({
    ids: projectIds,
    collection: context.collections.Projects,
  })),
);
