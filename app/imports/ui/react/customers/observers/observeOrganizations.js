import { Organizations } from '/imports/share/collections/organizations';
import {
  addOrganization,
  updateOrganization,
  removeOrganization,
} from '/imports/client/store/actions/collectionsActions';
import { getState } from '/imports/client/store';
import { expandCollapsedCustomer } from '../helpers';
import { createStoreMutationObserver } from '../../../../api/helpers';

const query = { isAdminOrg: { $ne: true } };

export default dispatch => createStoreMutationObserver(
  {
    added(_id, fields) {
      dispatch(addOrganization({ _id, ...fields }));
    },

    changed(_id, fields) {
      dispatch(updateOrganization({ _id, ...fields }));

      if (fields.customerType && getState('global.urlItemId') === _id) {
        expandCollapsedCustomer(_id);
      }
    },

    removed(_id) {
      dispatch(removeOrganization(_id));
    },
  },
  Organizations,
)(dispatch, query);
