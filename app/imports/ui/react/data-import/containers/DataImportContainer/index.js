import { compose, withHandlers, renameProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';

import { pickDeep, pickFrom, combineObjects } from '/imports/api/helpers';

import {
  setOrgsCollapsed,
  setOrgsLoading,
  setOrgsLoaded,
} from '/imports/client/store/actions/dataImportActions';
import { onToggleCollapse, onOrgClick } from './handlers';
import DataImport from '../../components/DataImport';

const enhance = compose(
  connect(combineObjects([
    pickDeep(['global.userId', 'organizations.organizationId']),
    pickFrom('dataImport', ['isLoading', 'isLoaded', 'ownOrganizations', 'areOrgsCollapsed']),
  ])),
  renameProps({
    areOrgsCollapsed: 'collapsed',
    isLoading: 'loading',
  }),
  withHandlers({ onToggleCollapse, onOrgClick }),
  lifecycle({
    componentWillUnmount() {
      const actions = [
        setOrgsCollapsed(true),
        setOrgsLoading(false),
        setOrgsLoaded(false),
      ];
      this.props.dispatch(batchActions(actions));
    },
  }),
);

export default enhance(DataImport);
