import checkDocsAccess from '../Document/checkDocsAccess';
import branch from '../helpers/branch';

export default () => branch(
  (root, args) => args.potentialGainIds,
  checkDocsAccess((root, { potentialGainIds }, context) => ({
    ids: potentialGainIds,
    collection: context.collections.NonConformities,
  })),
);
