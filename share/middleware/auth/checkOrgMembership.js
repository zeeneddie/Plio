
import { isOrgMember } from '../../checkers';
import Errors from '../../errors';

export default (
  getOrgId = (root, args) => args.organizationId,
) => async (next, root, args, context) => {
  const organizationId = getOrgId(root, args, context);

  if (!await isOrgMember(organizationId, context.userId)) {
    throw new Error(Errors.NOT_ORG_MEMBER);
  }

  return next(root, args, context);
};
