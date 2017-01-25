import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import StatusList from '../../components/StatusList';
import {
  lengthRisks,
  propEq,
} from '/imports/api/helpers';
import {
  getSelectedRiskDeletedState,
  handleRisksRedirectAndOpen,
  createRiskStatusItem,
  withRisksRedirectAndOpen,
} from '../../helpers';
import { problemsStatuses } from '../../../problems/constants';

const mapStateToProps = (state) => ({
  riskStatuses: problemsStatuses,
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
