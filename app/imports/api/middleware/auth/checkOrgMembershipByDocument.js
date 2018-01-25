import { checkOrgMembership } from '../../checkers';

/*
  interface Document {
    organizationId: String
  }
  () => (
    next: (args, context) => next,
    args: Object,
    context: { doc: Document, ...Object }
  ) => next
*/
export default () => (next, args, context) => {
  checkOrgMembership(context.userId, context.doc.organizationId);
  return next(args, context);
};
