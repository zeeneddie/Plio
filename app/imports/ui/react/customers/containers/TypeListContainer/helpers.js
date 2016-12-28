import { Meteor } from 'meteor/meteor';

import { expandCollapsedCustomer } from '../../helpers';
import { getC, propEqId } from '/imports/api/helpers';
import { goTo } from '/imports/ui/utils/router/actions';

export const redirectAndOpen = ({
  types,
  organizations = [],
  urlItemId,
}) => Meteor.defer(() => {
  let target = null;
  const org = organizations.find(propEqId(urlItemId));
  const defaultOrg = getC('types[0].organizations[0]', { types });

  if (!org && defaultOrg) {
    goTo('customer')({ urlItemId: defaultOrg._id });

    target = defaultOrg._id;
  } else if (org) target = org._id;

  return target && expandCollapsedCustomer(target);
});
