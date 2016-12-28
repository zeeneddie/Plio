import { Organizations } from '/imports/share/collections/organizations';
import { setOrganizations } from '/imports/client/store/actions/collectionsActions';

export default function loadMainData({ dispatch }, onData) {
  const query = { isAdminOrg: { $ne: true }, customerType: { $exists: true } };
  const projection = { sort: { serialNumber: 1 } };
  const organizations = Organizations.find(query, projection).fetch();

  dispatch(setOrganizations(organizations));
  onData(null, {});
}
