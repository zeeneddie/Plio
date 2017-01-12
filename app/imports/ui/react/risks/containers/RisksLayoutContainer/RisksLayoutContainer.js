import { compose, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { composeWithTracker } from 'react-komposer';
import { pickDeep } from '/imports/api/helpers';
import { RiskFilters } from '/imports/api/constants';
import orgDataLoader from '/imports/client/dataLoaders/orgDataLoader';
import RisksLayout from '../../components/RisksLayout';
import onHandleFilterChange from '../../../handlers/onHandleFilterChange';
import onHandleReturn from '../../../handlers/onHandleReturn';

const enhance = compose(
  composeWithTracker(orgDataLoader),
  connect(),
  withProps((props) => ({
    ...props,
    filters: RiskFilters,
  })),
  connect(pickDeep([
    'global.filter',
    'organizations.orgSerialNumber',
    'organizations.organization',
  ])),
  withHandlers({
    onHandleFilterChange,
    onHandleReturn,
  }),
);

export default enhance(RisksLayout);
