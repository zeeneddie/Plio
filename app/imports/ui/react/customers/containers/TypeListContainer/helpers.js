import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { addCollapsed } from '/client/redux/actions/globalActions';
import { createTypeItem } from '../../helpers';
import { getC, propEqId } from '/imports/api/helpers';

export const redirectAndOpen = ({
  types,
  organizations,
  urlItemId,
  dispatch,
}) => Meteor.defer(() => {
  const org = organizations.find(propEqId(urlItemId));
  const defaultOrg = getC('types[0].organizations[0]', { types });

  if (!org && defaultOrg) {
    FlowRouter.go('customer', {
      urlItemId: defaultOrg._id,
    });

    const typeItem = createTypeItem(defaultOrg.customerType);
    dispatch(addCollapsed({ ...typeItem, close: { type: typeItem.type } }));
  }
});
