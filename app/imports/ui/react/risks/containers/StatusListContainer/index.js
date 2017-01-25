import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import StatusList from '../../components/StatusList';
import { propEq } from '/imports/api/helpers';
import {
  getSelectedRiskDeletedState,
  handleRisksRedirectAndOpen,
  createRiskStatusItem,
  withRisksRedirectAndOpen,
} from '../../helpers';
import { problemsStatuses } from '../../../problems/constants';

const mapStateToProps = (state) => ({
  ...getSelectedRiskDeletedState(state),
});

const redirectAndOpen = ({ statuses, risksByIds, ...props }) => handleRisksRedirectAndOpen(
  compose(createRiskStatusItem, property('value')),
  statuses,
  risksByIds,
  props
);

export default compose(
  connect(mapStateToProps),
  mapProps(({ risks = [], ...props }) => {
    // add own risks to each status
    const reducer = (prev, status) => {
      const ownRisks = risks.filter(propEq('status', status.value));

      if (ownRisks.length) return prev.concat({ ...status, risks: ownRisks });

      return prev;
    };

    const statuses = problemsStatuses.reduce(reducer, []);

    return { ...props, statuses };
  }),
  withRisksRedirectAndOpen(redirectAndOpen),
)(StatusList);
