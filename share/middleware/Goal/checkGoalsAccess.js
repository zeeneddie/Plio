import checkDocsAccess from '../Document/checkDocsAccess';
import branch from '../helpers/branch';

export default () => branch(
  (root, args) => args.goalIds,
  checkDocsAccess((root, { goalIds }, context) => ({
    ids: goalIds || [],
    collection: context.collections.Goals,
  })),
);
