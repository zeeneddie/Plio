import checkDocAccess from '../Document/checkDocAccess';
import branch from '../helpers/branch';

export default () => branch(
  (root, args) => args.sectionId,
  checkDocAccess(async (root, { sectionId }, context) => ({
    query: { _id: sectionId },
    collection: context.collections.StandardsBookSections,
  })),
);
