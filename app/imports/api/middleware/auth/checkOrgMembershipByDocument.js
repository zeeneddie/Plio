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
export default () => (next, args, context) => {
  checkOrgMembership(context.userId, context.document.organizationId);
  return next(args, context);
};
