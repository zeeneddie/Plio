import { Meteor } from 'meteor/meteor';
import { ifElse, view, useWith } from 'ramda';
import { lenses } from 'plio-util';

import { isOrgMember } from '../../checkers';
import Errors from '../../errors';

const { userId, organizationId } = lenses;

export default lens => (next, args, context) => ifElse(
  useWith(isOrgMember, [
    view(lens || organizationId),
    view(userId),
  ]),
  (...args) => next(...args),
  () => {
    throw new Meteor.Error(403, Errors.NOT_ORG_MEMBER);
  },
)(args, context);
