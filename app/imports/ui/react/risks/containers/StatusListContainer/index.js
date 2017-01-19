import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';

import StatusList from '../../components/StatusList';
import {
  lengthRisks,
  propEq,
} from '/imports/api/helpers';
import { getState } from '/imports/client/store';
import { RiskFilterIndexes } from '/imports/api/constants';
import { ProblemsStatuses } from '/imports/share/constants';
import {
  openRiskByFilter,
  getSelectedAndDefaultRiskByFilter,
  getSelectedRiskDeletedState,
} from '../../helpers';

const mapStateToProps = (state) => ({
  riskStatuses: Object.keys(ProblemsStatuses).map(status => ({
    number: status,
    title: ProblemsStatuses[status],
  })),
  ...getSelectedRiskDeletedState(state),
});

const openType = (props) => setTimeout(() => {
  const urlItemId = getState('global.urlItemId');
  const risksByIds = getState('collections.risksByIds');
  const {
    containedIn,
    defaultContainedIn,
    selectedRisk,
  } = getSelectedAndDefaultRiskByFilter({
    urlItemId,
    statuses: props.statuses,
    filter: RiskFilterIndexes.STATUS,
  });

  // if risk does not exist, do not open type.
  // show message that risk does not exist instead.
  if (urlItemId && !risksByIds[urlItemId]) {
    return;
  }

  // if a type contains selected risk open that type otherwise open default type collapse
  openRiskByFilter({
    selectedRisk,
    containedIn,
    defaultContainedIn,
    dispatch: props.dispatch,
    filter: RiskFilterIndexes.STATUS,
  });
}, 0);

export default compose(
  connect(mapStateToProps),
  mapProps(({ riskStatuses, risks, ...props }) => {
    let statuses = riskStatuses;

    // add own risks to each type
    statuses = statuses.map(status => ({
      ...status,
      risks: risks.filter(propEq('status', Number(status.number))),
    }));

    statuses = statuses.filter(lengthRisks);

    return { ...props, statuses };
  }),
  lifecycle({
    componentWillMount() {
      openType(this.props);
    },
    // if selected risk is deleted open the default type
    componentWillReceiveProps(nextProps) {
      if (!this.props.isSelectedRiskDeleted && nextProps.isSelectedRiskDeleted) {
        openType(nextProps);
      }
    },
  }),
)(StatusList);
