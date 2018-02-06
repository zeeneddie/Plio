import { Meteor } from 'meteor/meteor';
import { isOrgMember } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  if (!await isOrgMember(context.operation.doc.organizationId, args.ownerId)) {
    throw new Meteor.Error(403, Errors.USER_NOT_ORG_MEMBER);
  }

  return next(root, args, context);
};
