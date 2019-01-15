import { checkDocAccess } from '../document';
import { branch } from '../helpers';

export default () => branch(
  (root, args) => args.sectionId,
  checkDocAccess(async (root, { sectionId }, context) => ({
    query: { _id: sectionId },
    collection: context.collections.StandardsBookSections,
  })),
);
