import { checkOrgMembership } from '../../checkers';

export default (arg = 'organizationId') => (next, root, args, context) => {
  checkOrgMembership(context.userId, args[arg]);
  return next(root, args, context);
};
