import invariant from 'invariant';

import { isOrgMember } from '../../checkers';
import Errors from '../../errors';

export default (
  getOrgId = (root, args) => args.organizationId,
) => async (next, root, args, context) => {
  const organizationId = await getOrgId(root, args, context);
  const organization = await isOrgMember(organizationId, context.userId);

  invariant(organization, Errors.NOT_ORG_MEMBER);

  return next(root, args, { ...context, organization });
};
