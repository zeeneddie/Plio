import { checkOrgMembership } from '../../checkers';

export default (arg = 'organizationId') => (next, args, context) => {
  checkOrgMembership(context.userId, args[arg]);
  return next(args, context);
};
