import { batchActions } from 'redux-batched-actions';

import { Organizations } from '/imports/share/collections/organizations';
import { setOrg, setOrgId } from '/imports/client/store/actions/organizationsActions';
import { setDataLoading } from '/imports/client/store/actions/globalActions';
import { getId } from '/imports/api/helpers';

export default subscribe => function loadLayoutData({
    dispatch,
    orgSerialNumber,
    ...props,
  }, onData) {
  const subscription = subscribe({ orgSerialNumber, ...props });

  if (subscription.ready()) {
    const organization = Organizations.findOne({ serialNumber: orgSerialNumber });
    const organizationId = getId(organization);
    const actions = [
      setOrg(organization),
      setOrgId(organizationId),
      setDataLoading(false),
    ];

    dispatch(batchActions(actions));

    onData(null, { loading: false });
  } else {
    dispatch(setDataLoading(true));

    onData(null, { loading: true });
  }

  // return () => typeof subscription === 'function' && subscription.stop();
};
