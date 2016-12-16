import { Organizations } from '/imports/share/collections/organizations';
import {
  addOrganization,
  updateOrganization,
  removeOrganization,
} from '/client/redux/actions/collectionsActions';

export default (dispatch) => {
  const query = { isAdminOrg: { $ne: true } };

  const handle = Organizations.find(query).observeChanges({
    added(_id, fields) {
      if (handle) {
        console.log('added');
        dispatch(addOrganization({ _id, ...fields }));
      }
    },

    changed(_id, fields) {
      console.log('changed');
      dispatch(updateOrganization({ _id, ...fields }));
    },

    removed(_id) {
      console.log('removed');
      dispatch(removeOrganization(_id));
    },
  });

  return handle;
};
