import { checkDocsAccess } from '../document';
import { branch } from '../helpers';

export default () => branch(
  (root, args) => args.projectIds,
  checkDocsAccess((root, { projectIds }, context) => ({
    ids: projectIds,
    collection: context.collections.Projects,
  })),
);
