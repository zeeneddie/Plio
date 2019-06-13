import checkDocsAccess from '../Document/checkDocsAccess';
import branch from '../helpers/branch';

export default () => branch(
  (root, args) => args.riskIds,
  checkDocsAccess((root, { riskIds }, context) => ({
    ids: riskIds || [],
    collection: context.collections.Risks,
  })),
);
