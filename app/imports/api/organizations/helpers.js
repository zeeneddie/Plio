import property from 'lodash.property';

import { getC, find, propEq, compose, not, every } from '/imports/api/helpers';
import { UserMembership } from '/imports/share/constants';

export const notRemoved = compose(not, property('isRemoved'));

export const getOwnerId = compose(
  getC('userId'),
  find(every([
    propEq('role', UserMembership.ORG_OWNER),
    notRemoved,
  ])),
);
