/* eslint-disable new-cap */

import { SHA256 } from 'meteor/sha';

import store from '/client/redux/store';
import { callMethod, setErrorText, close } from '/client/redux/actions/modalActions';
import { deleteOrganization } from '/imports/api/organizations/methods';
import swal from '/imports/ui/utils/swal';
import { ORG_DELETE, ORG_DELETE_PASSWORD } from '/imports/api/swal-params';
import { compileTemplateObject } from '/imports/api/helpers';


// BUG: modal doesn't close
export const handleOrgDelete = ({
  organization: {
    _id: organizationId,
    name: orgName,
  },
}) => () => {
  const deleteOrg = (password) => {
    if (!password) {
      swal.close();
      return store.dispatch(setErrorText('Password can not be empty'));
    }

    const ownerPassword = SHA256(password);

    return store.dispatch(callMethod(deleteOrganization, { organizationId, ownerPassword }))
      .then(() => {
        store.dispatch(close);
        swal.success('Success', `Organization ${orgName} has been deleted`);
      });
  };

  const showPasswordInput = () =>
    swal(compileTemplateObject(ORG_DELETE_PASSWORD, { orgName }), deleteOrg);

  return swal(ORG_DELETE, showPasswordInput);
};
