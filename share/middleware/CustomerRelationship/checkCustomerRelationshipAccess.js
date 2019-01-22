import checkDocAccess from '../Document/checkDocAccess';

export default (config = () => ({})) =>
  checkDocAccess(async (root, args, context) => ({
    ...await config(root, args, context),
    collection: context.collections.CustomerRelationships,
  }));
