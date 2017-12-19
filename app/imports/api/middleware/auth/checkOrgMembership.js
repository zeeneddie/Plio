import { checkOrgMembership } from '../../checkers';

export default () => (next, args, context) => {
  checkOrgMembership(context.userId, args.organizationId);
  return next(args, context);
};
