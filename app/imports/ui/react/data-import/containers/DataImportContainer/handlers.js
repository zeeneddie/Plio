import { batchActions } from 'redux-batched-actions';

import { OrgSubs } from '/imports/startup/client/subsmanagers';
import { createOrgQueryWhereUserIsOwner } from '/imports/api/queries';
import { Organizations } from '/imports/share/collections/organizations';
import {
  setOwnOrgs,
  setOrgsLoading,
  setOrgsLoaded,
  setOrgsCollapsed,
} from '/imports/client/store/actions/dataImportActions';
import swal from '/imports/ui/utils/swal';

export const onToggleCollapse = ({
  dispatch,
  userId,
  isLoaded,
  loading,
  collapsed,
}) => () => {
  const loadFetchDataAndToggle = () => {
    dispatch(setOrgsLoading(true));

    const onReady = () => {
      const query = createOrgQueryWhereUserIsOwner(userId);
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

export const onOrgClick = ({ dispatch, documentType }) => ({ name }) => {
  const onConfirm = () => null

  swal({
    text: `Do you want to import ${50} ${documentType} documents from the "${name}" organization?`,
    confirmButtonText: 'Yes',
  }, onConfirm);
};
