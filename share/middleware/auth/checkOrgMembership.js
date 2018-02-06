import { Meteor } from 'meteor/meteor';
import { view } from 'ramda';
import { lenses } from 'plio-util';

import { isOrgMember } from '../../checkers';
import Errors from '../../errors';

export default (getOrgId = view(lenses.organizationId)) => async (next, root, args, context) => {
  const organizationId = getOrgId(args, context);

  if (!isOrgMember(organizationId, view(lenses.userId, context))) {
    throw new Meteor.Error(403, Errors.NOT_ORG_MEMBER);
  }

  return next(root, args, context);
};
