import { compose, withHandlers, renameProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';

import { OrgSubs } from '/imports/startup/client/subsmanagers';
import { pickDeep, pickFrom, combineObjects } from '/imports/api/helpers';
import { createOrgQueryWhereUserIsOwner } from '/imports/api/queries';
import { Organizations } from '/imports/share/collections/organizations';
import {
  setOwnOrgs,
  setOrgsLoading,
  setOrgsLoaded,
  setOrgsCollapsed,
} from '/imports/client/store/actions/dataImportActions';
import ModalDataImport from '../../components/ModalDataImport';

const enhance = compose(
  connect(combineObjects([
    pickDeep(['global.userId']),
    pickFrom('dataImport', ['isLoading', 'isLoaded', 'ownOrganizations', 'areOrgsCollapsed']),
  ])),
  renameProps({
    areOrgsCollapsed: 'collapsed',
    isLoading: 'loading',
  }),
  withHandlers({
    onToggleCollapse: ({
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
            setOrgsLoaded(true),
            setOrgsLoading(false),
            setOwnOrgs(organizations),
            setOrgsCollapsed(false),
          ];


          dispatch(batchActions(actions));
        };

        OrgSubs.subscribe('dataImportUserOwnOrganizations', onReady);
      };
      // when the user first time clicks on the collapse load and fetch the data
      // otherwise just toggle the collapse
      if (collapsed && !isLoaded && !loading) loadFetchDataAndToggle();
      else dispatch(setOrgsCollapsed(!collapsed));
    },
  }),
  lifecycle({
    componentWillUnmount() {
      this.props.dispatch(setOrgsCollapsed(true));
    },
  }),
);

export default enhance(ModalDataImport);
