import { FlowRouter } from 'meteor/kadira:flow-router';
import { batchActions } from 'redux-batched-actions';
import { Organizations } from '/imports/share/collections/organizations';
import { OrgSubs } from '/imports/startup/client/subsmanagers';

import store from '../../store';
import { setOrg, setOrgId, setOrgSerialNumber } from '../../store/actions/organizationsActions';

export default function orgDataLoader(props, onData) {
  const querySerialNumberParam = FlowRouter.getParam('orgSerialNumber');
  const serialNumber = parseInt(querySerialNumberParam, 10);
  const sub = OrgSubs.subscribe('currentUserOrganizationBySerialNumber', serialNumber);

  if (sub.ready()) {
    const organization = Organizations.findOne({ serialNumber });

    const actions = batchActions([
      setOrg(organization),
      setOrgId(organization._id),
      setOrgSerialNumber(serialNumber),
    ]);

    store.dispatch(actions);
  }

  onData(null, {});
}
