/* eslint-disable new-cap */

import { SHA256 } from 'meteor/sha';

import store, { getState } from '/client/redux/store';
import { callMethod, setErrorText, close } from '/client/redux/actions/modalActions';
import { deleteCustomerOrganization } from '/imports/api/organizations/methods';
import swal from '/imports/ui/utils/swal';
import { ORG_DELETE, ORG_DELETE_PASSWORD } from '/imports/api/swal-params';
import { compileTemplateObject } from '/imports/api/helpers';
import { initCustomerTypes } from '../../../../helpers';
import { redirectAndOpen } from '../../../../containers/TypeListContainer/helpers';


// BUG: modal doesn't close
export const handleOrgDelete = ({
  _id: organizationId,
  name: orgName,
}) => () => {
  const deleteOrg = (password) => {
    if (!password) {
      swal.close();
      return store.dispatch(setErrorText('Password can not be empty'));
    }

    const adminPassword = SHA256(password);

    return store.dispatch(callMethod(deleteCustomerOrganization, { organizationId, adminPassword }))
      .then(() => {
        store.dispatch(close);
        swal.success('Success', `Organization ${orgName} has been deleted`);

        // redirect and expand the default customer
        const { organizations } = getState('collections');
        const { types } = initCustomerTypes({ organizations });
        redirectAndOpen({ organizations, types });
      });
  };

  const showPasswordInput = () =>
    swal(compileTemplateObject(ORG_DELETE_PASSWORD, { orgName }), deleteOrg);

  return swal(ORG_DELETE, showPasswordInput);
};
