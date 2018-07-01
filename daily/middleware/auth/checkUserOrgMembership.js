import { isOrgMember } from '../../checkers';
import Errors from '../../errors';

export default ({
  getOrganizationId = (root, args, context) => context.doc.organizationId,
  getUserId = (root, args) => args.userId,
} = {}) => async (next, root, args, context) => {
  const organizationId = await getOrganizationId(root, args, context);
  const userId = await getUserId(root, args, context);

  if (!await isOrgMember(organizationId, userId)) {
    throw new Error(Errors.USER_NOT_ORG_MEMBER);
  }

  return next(root, args, context);
};
