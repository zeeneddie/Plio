import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { expandCollapsedCustomer } from '../../helpers';
import { getC, propEqId } from '/imports/api/helpers';

export const redirectAndOpen = ({
  types,
  organizations = [],
  urlItemId,
}) => Meteor.defer(() => {
  let target = null;
  const org = organizations.find(propEqId(urlItemId));
  const defaultOrg = getC('types[0].organizations[0]', { types });

  if (!org && defaultOrg) {
    FlowRouter.go('customer', {
      urlItemId: defaultOrg._id,
    });

    target = defaultOrg._id;
  } else if (org) target = org._id;

  return target && expandCollapsedCustomer(target);
});
