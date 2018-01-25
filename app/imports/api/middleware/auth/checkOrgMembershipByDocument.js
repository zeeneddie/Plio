import { checkOrgMembership } from '../../checkers';

/*
  interface Document {
    organizationId: String
  }
  () => (
    next: (args, context) => next,
    args: Object,
    context: { document: Document, ...Object }
  ) => next
*/
export default () => (next, root, args, context) => {
  checkOrgMembership(context.userId, context.doc.organizationId);
  return next(root, args, context);
};
