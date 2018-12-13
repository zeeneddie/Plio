import { checkDocsAccess } from '../document';
import { branch } from '../helpers';

export default () => branch(
  (root, args) => args.goalIds,
  checkDocsAccess((root, { goalIds }, context) => ({
    ids: goalIds || [],
    collection: context.collections.Goals,
  })),
);
