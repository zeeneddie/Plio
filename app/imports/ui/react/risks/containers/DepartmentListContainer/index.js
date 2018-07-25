import { compose } from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import DepartmentList from '../../components/DepartmentList';
import {
  getId,
} from '../../../../../api/helpers';
import {
  handleRisksRedirectAndOpen,
  createRiskDepartmentItem,
  withRisksRedirectAndOpen,
} from '../../helpers';
import {
  getRisksDepartmentsList,
  getSelectedRiskIsDeleted,
} from '../../../../../client/store/selectors/risks';

const mapStateToProps = (state, props) => ({
  departments: getRisksDepartmentsList(state, props),
  isSelectedRiskDeleted: getSelectedRiskIsDeleted(state),
});

const redirectAndOpen = ({ departments, risksByIds, ...props }) => handleRisksRedirectAndOpen(
  compose(createRiskDepartmentItem, getId),
  departments,
  risksByIds,
  props,
);

export default compose(
  connect(mapStateToProps),
  // redirect and open on mount only if departments are ready
  withRisksRedirectAndOpen(redirectAndOpen, { processOnMount: property('areDepsReady') }),
)(DepartmentList);
