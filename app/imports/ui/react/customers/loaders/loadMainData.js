import { Organizations } from '/imports/share/collections/organizations';
import { setOrganizations } from '/imports/client/store/actions/collectionsActions';

export default function loadMainData({ dispatch }, onData) {
  const organizations = Organizations.find({
    isAdminOrg: { $ne: true },
  }, {
    sort: { serialNumber: 1 },
  }).fetch();

  dispatch(setOrganizations(organizations));
  onData(null, {});
}
