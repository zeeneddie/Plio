import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { batchActions } from 'redux-batched-actions';

import { setUserId, setFilter, setUrlItemId } from '/imports/client/store/actions/globalActions';
import { setOrgSerialNumber } from '/imports/client/store/actions/organizationsActions';

export default function loadInitialData({ dispatch }, onData) {
  const userId = Meteor.userId();
  const orgSerialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'), 10);
  const filter = parseInt(FlowRouter.getQueryParam('filter'), 10) || 1;
  const urlItemId = FlowRouter.getParam('urlItemId');

  const actions = [
    setUserId(userId),
    setOrgSerialNumber(orgSerialNumber),
    setFilter(filter),
    setUrlItemId(urlItemId),
  ];

  dispatch(batchActions(actions));

  onData(null, {});
}
