import { batchActions } from 'redux-batched-actions';
import { SHA256 } from 'meteor/sha';
import pluralize from 'pluralize';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { OrgSubs } from '/imports/startup/client/subsmanagers';
import { createOrgQueryWhereUserIsOwner } from '../../../../../share/mongo/queries';
import { Organizations } from '../../../../../share/collections/organizations';
import {
  setOwnOrgs,
  setOrgsLoading,
  setOrgsLoaded,
  setOrgsCollapsed,
  setDataImportInProgress,
} from '../../../../../client/store/actions/dataImportActions';
import { callMethod, setErrorText, close } from '../../../../../client/store/actions/modalActions';
import { importDocuments } from '../../../../../api/organizations/methods';
import { swal } from '../../../../../client/util';

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
        setOwnOrgs(organizations),
        setOrgsLoaded(true),
        setOrgsLoading(false),
        setOrgsCollapsed(false),
      ];

      dispatch(batchActions(actions));
    };
    const sub = OrgSubs.subscribe('dataImportUserOwnOrganizations');

    Tracker.autorun((comp) => {
      if (sub.ready()) {
        onReady();
        comp.stop();
      }
    });
  };
  // when the user first time clicks on the collapse load and fetch the data
  // otherwise just toggle the collapse
  if (collapsed && !isLoaded && !loading) loadFetchDataAndToggle();
  else if (!loading && isLoaded) dispatch(setOrgsCollapsed(!collapsed));
};

export const onOrgClick = ({
  dispatch,
  documentType,
  organizationId,
  getDocsCount,
  onSuccess,
}) => ({ _id: from, name }) => {
  const onConfirm = (pwd) => {
    const _onSuccess = (res) => {
      dispatch(close);

      swal.success(
        'Success',
        `Data import from ${name} organization has been successfully completed`,
      );
      if (typeof onSuccess === 'function') onSuccess(res);
    };

    if (!pwd) {
      swal.close();
      return dispatch(setErrorText('Password can not be empty'));
    }

    const password = SHA256(pwd); // eslint-disable-line new-cap
    const methodProps = {
      documentType,
      password,
      from,
      to: organizationId,
    };
    const action = callMethod(importDocuments, methodProps);

    dispatch(setDataImportInProgress(true));

    return dispatch(action).then(_onSuccess).catch((err) => {
      dispatch(setDataImportInProgress(false));
      // Hack to show the error message. Are there better ways to achieve this?
      Meteor.setTimeout(() => {
        swal.error(err);
      }, 1500);
    });
  };

  const showPwdForm = () => swal.showPasswordForm({
    title: `Confirm data import from "${name}" organization`,
  }, onConfirm);

  const showAlert = (__, count = '') => {
    if (count) {
      const text = `
        Do you want to import ${count} ${documentType} ${pluralize('documents', count)}
        from "${name}" organization?
      `;

      return swal({
        text,
        confirmButtonText: 'Yes',
        showLoaderOnConfirm: false,
      }, showPwdForm);
    }

    const reason = `There are no ${documentType} documents in "${name}" organization`;

    return swal.error({ reason });
  };

  swal({
    text: 'Loading...',
    showConfirmButton: false,
    showCancelButton: false,
  });

  if (typeof getDocsCount === 'function') {
    Meteor.setTimeout(() =>
      getDocsCount({ organizationId: from, isDeleted: false }, showAlert), 1000);
  }
};
