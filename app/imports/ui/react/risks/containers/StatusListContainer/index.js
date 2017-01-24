import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import StatusList from '../../components/StatusList';
import {
  lengthRisks,
  propEq,
} from '/imports/api/helpers';
import { ProblemsStatuses } from '/imports/share/constants';
import {
  getSelectedRiskDeletedState,
  handleRisksRedirectAndOpen,
  createRiskStatusItem,
  withRisksRedirectAndOpen,
} from '../../helpers';

const mapStateToProps = (state) => ({
  riskStatuses: Object.keys(ProblemsStatuses).map(status => ({
    number: status,
    title: ProblemsStatuses[status],
  })),
  ...getSelectedRiskDeletedState(state),
});

const redirectAndOpen = ({ statuses, risksByIds, ...props }) => handleRisksRedirectAndOpen(
  compose(createRiskStatusItem, property('number')),
  statuses,
  risksByIds,
  props
);

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
  withRisksRedirectAndOpen(redirectAndOpen),
)(StatusList);
