import { batchActions } from 'redux-batched-actions';

import { DocumentLayoutSubs } from '/imports/startup/client/subsmanagers';
import { Organizations } from '/imports/share/collections/organizations';
import { setOrg, setOrgId } from '/client/redux/actions/organizationsActions';
import { setDataLoading } from '/client/redux/actions/globalActions';
import { getId } from '/imports/api/helpers';

export default subscribe => function loadLayoutData({
    dispatch,
    filter,
    orgSerialNumber,
  }, onData) {
  const subscription = subscribe({ filter, orgSerialNumber });

  if (subscription.ready()) {
    const organization = Organizations.findOne({ serialNumber: orgSerialNumber });
    const organizationId = getId(organization);
    const actions = [
      setOrg(organization),
      setOrgId(organizationId),
      setDataLoading(false),
    ];

    dispatch(batchActions(actions));

    onData(null, {});
  } else {
    dispatch(setDataLoading(true));

    onData(null, null);
  }

  return () => typeof subscription === 'function' && subscription.stop();
};
