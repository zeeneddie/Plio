import { lifecycle, compose } from 'recompose';
import { connect } from 'react-redux';

import RisksListContainer from '../RisksListContainer';
import {
  handleRisksRedirectAndOpen,
} from '../../helpers';
import { pickDeep } from '/imports/api/helpers';

const redirect = ({ risks, risksByIds, ...props }) => handleRisksRedirectAndOpen(
  () => null,
  [{ risks }],
  risksByIds,
  props,
);

export default compose(
  connect(pickDeep(['global.searchText', 'risks.risksFiltered', 'collections.risksByIds'])),
  lifecycle({
    componentWillMount() {
      // handle redirect to default risk
      redirect(this.props);
    },
    componentWillReceiveProps(nextProps) {
      if ((!this.props.isSelectedRiskDeleted && nextProps.isSelectedRiskDeleted) ||
          (nextProps.searchText && nextProps.risksFiltered.length)) {
        redirect(nextProps);
      }
    },
  })
)(RisksListContainer);
