import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import StatusList from '../../components/StatusList';
import {
  lengthRisks,
  propEq,
  pickDeep,
} from '/imports/api/helpers';
import { ProblemsStatuses } from '/imports/share/constants';
import {
  getSelectedRiskDeletedState,
  handleRisksRedirectAndOpen,
  createRiskStatusItem,
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
  connect(pickDeep(['global.searchText', 'risks.risksFiltered', 'collections.risksByIds'])),
  lifecycle({
    componentWillMount() {
      redirectAndOpen(this.props);
    },
    // if selected risk is deleted open the default type
    componentWillReceiveProps(nextProps) {
      if ((!this.props.isSelectedRiskDeleted && nextProps.isSelectedRiskDeleted) ||
          (nextProps.searchText && nextProps.risksFiltered.length)) {
        redirectAndOpen(nextProps);
      }
    },
  }),
)(StatusList);
