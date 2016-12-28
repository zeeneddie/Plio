import { FlowRouter } from 'meteor/kadira:flow-router';
import { batchActions } from 'redux-batched-actions';
import { setOrg, setOrgId, setOrgSerialNumber } from '/imports/client/store/actions/organizationsActions';
import { Organizations } from '/imports/share/collections/organizations';

export default function initMainData({ store }, onData) {
  const querySerialNumberParam = FlowRouter.getParam('orgSerialNumber');
  const serialNumber = parseInt(querySerialNumberParam, 10);
  const organization = Organizations.findOne({ serialNumber });

  const actions = batchActions([
    setOrg(organization),
    setOrgId(organization._id),
    setOrgSerialNumber(serialNumber),
  ]);

  store.dispatch(actions);

  onData(null, {});
}
