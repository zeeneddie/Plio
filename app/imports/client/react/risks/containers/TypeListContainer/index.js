import { compose } from 'recompose';
import { connect } from 'react-redux';

import TypeList from '../../components/TypeList';
import { getId } from '../../../../../api/helpers';
import {
  createRiskTypeItem,
  handleRisksRedirectAndOpen,
  withRisksRedirectAndOpen,
} from '../../helpers';
import {
  getRiskTypesWithUncategorized,
  getSelectedRiskIsDeleted,
} from '../../../../store/selectors/risks';

const mapStateToProps = (state, props) => ({
  types: getRiskTypesWithUncategorized(state, props),
  isSelectedRiskDeleted: getSelectedRiskIsDeleted(state),
});

const redirectAndOpen = ({ types, risksByIds, ...props }) => handleRisksRedirectAndOpen(
  compose(createRiskTypeItem, getId),
  types,
  risksByIds,
  props,
);

export default compose(
  connect(mapStateToProps),
  withRisksRedirectAndOpen(redirectAndOpen),
)(TypeList);
