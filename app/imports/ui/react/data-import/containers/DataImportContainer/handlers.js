import { batchActions } from 'redux-batched-actions';
import { SHA256 } from 'meteor/sha';

import { OrgSubs } from '/imports/startup/client/subsmanagers';
import { createOrgQueryWhereUserIsOwner } from '/imports/api/queries';
import { Organizations } from '/imports/share/collections/organizations';
import {
  setOwnOrgs,
  setOrgsLoading,
  setOrgsLoaded,
  setOrgsCollapsed,
} from '/imports/client/store/actions/dataImportActions';
import { callMethod, setErrorText, close } from '/imports/client/store/actions/modalActions';
import swal from '/imports/ui/utils/swal';
import { importDocuments } from '/imports/api/organizations/methods';

export const onToggleCollapse = ({
  dispatch,
  userId,
  isLoaded,
  loading,
  collapsed,
  organizationId,
}) => () => {
  const loadFetchDataAndToggle = () => {
    dispatch(setOrgsLoading(true));

    const onReady = () => {
      const query = {
        _id: { $ne: organizationId },
        ...createOrgQueryWhereUserIsOwner(userId),
      };
      const options = { sort: { serialNumber: 1 } };
      const organizations = Organizations.find(query, options).fetch();
      const actions = [
        setOrgsCollapsed(false),
        setOrgsLoaded(true),
        setOrgsLoading(false),
        setOwnOrgs(organizations),
      ];

      dispatch(batchActions(actions));
    };

    OrgSubs.subscribe('dataImportUserOwnOrganizations', onReady);
  };
  // when the user first time clicks on the collapse load and fetch the data
  // otherwise just toggle the collapse
  if (collapsed && !isLoaded && !loading) loadFetchDataAndToggle();
  else dispatch(setOrgsCollapsed(!collapsed));
};

export const onOrgClick = ({ dispatch, documentType, organizationId }) => ({ _id, name }) => {
  const onConfirm = (pwd) => {
    if (!pwd) {
      swal.close();
      return dispatch(setErrorText('Password can not be empty'));
    }

    const password = SHA256(pwd); // eslint-disable-line new-cap
    const methodProps = {
      documentType,
      password,
      to: organizationId,
      from: _id,
    };
    const action = callMethod(importDocuments, methodProps);

    return dispatch(action).then(() => {
      dispatch(close);
      swal.success(
        'Success',
        `Data import from ${name} organization has been successfully completed`
      );
    });
  };

  const showPwdForm = () => swal.showPasswordForm({
    title: `Confirm data import from "${name}" organization`,
  }, onConfirm);

  // TODO: show the actual number of documents
  swal({
    text: `Do you want to import ${50} ${documentType} documents from "${name}" organization?`,
    confirmButtonText: 'Yes',
  }, showPwdForm);
};
