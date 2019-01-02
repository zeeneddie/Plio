import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { batchActions } from 'redux-batched-actions';

import { OrgSettingsDocSubs } from '../../../../startup/client/subsmanagers';
import { setOrganizations } from '../../../store/actions/collectionsActions';
import { getSelectedOrgSerialNumber } from '../../../../api/helpers';
import { Organizations } from '../../../../share/collections/organizations';
import { setUserId, setUrlItemId, setDataLoading } from '../../../store/actions/globalActions';

export default ({ dispatch }, onData) => {
  const serialNumber = parseInt(getSelectedOrgSerialNumber(), 10);
  const subscription = OrgSettingsDocSubs.subscribe(
    'currentUserOrganizationBySerialNumber',
    serialNumber,
  );
  const userId = Meteor.userId();
  const urlItemId = FlowRouter.getParam('helpId');

  if (subscription.ready()) {
    const organization = Organizations.findOne({ serialNumber });

    dispatch(batchActions([
      setUserId(userId),
      setUrlItemId(urlItemId),
      setOrganizations([organization]),
    ]));
  } else {
    dispatch(setDataLoading(true));
  }

  onData(null, {});
};
