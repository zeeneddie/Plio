import { compose } from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import ProjectList from '../components/ProjectList';
import { getId } from '../../../../api/helpers';
import {
  handleRisksRedirectAndOpen,
  createRiskProjectItem,
  withRisksRedirectAndOpen,
} from '../helpers';
import {
  getRisksProjectsList,
  getSelectedRiskIsDeleted,
} from '../../../store/selectors/risks';

const mapStateToProps = (state, props) => ({
  projects: getRisksProjectsList(state, props),
  isSelectedRiskDeleted: getSelectedRiskIsDeleted(state),
});

const redirectAndOpen = ({ projects, risksByIds, ...props }) => handleRisksRedirectAndOpen(
  compose(createRiskProjectItem, getId),
  projects,
  risksByIds,
  props,
);

export default compose(
  connect(mapStateToProps),
  // redirect and open on mount only if projects are ready
  withRisksRedirectAndOpen(redirectAndOpen, { processOnMount: property('areDepsReady') }),
)(ProjectList);
