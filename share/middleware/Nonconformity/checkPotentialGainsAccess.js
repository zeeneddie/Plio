import { checkDocsAccess } from '../document';
import { branch } from '../helpers';

export default () => branch(
  (root, args) => args.potentialGainIds,
  checkDocsAccess((root, { potentialGainIds }, context) => ({
    ids: potentialGainIds,
    collection: context.collections.NonConformities,
  })),
);
