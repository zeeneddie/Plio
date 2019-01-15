import checkDocsAccess from '../Document/checkDocsAccess';

export default (config = () => ({})) =>
  checkDocsAccess(async (root, args, context) => ({
    ...await config(root, args, context),
    ids: args.fileIds || [],
    collection: context.collections.Files,
  }));
