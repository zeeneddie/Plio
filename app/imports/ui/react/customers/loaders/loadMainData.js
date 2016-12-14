import { Organizations } from '/imports/share/collections/organizations';
import { setOrganizations } from '/client/redux/actions/collectionsActions';

export default function loadMainData({ dispatch }, onData) {
  const organizations = Organizations.find({}, { sort: { name: 1 } }).fetch();

  dispatch(setOrganizations(organizations));
  onData(null, {});
}
