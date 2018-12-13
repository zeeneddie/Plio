import { checkDocsAccess } from '../document';
import { branch } from '../helpers';

export default () => branch(
  (root, args) => args.standardsIds,
  checkDocsAccess((root, { standardsIds }, context) => ({
    ids: standardsIds,
    collection: context.collections.Standards,
  })),
);
