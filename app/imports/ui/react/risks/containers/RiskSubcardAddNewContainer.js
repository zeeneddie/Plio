import { connect } from 'react-redux';

import RiskSubcardAddNew from '../components/RiskSubcardAddNew';
import { getSortedUsersByFirstNameAsItems } from '../../../../client/store/selectors/users';
import { getRiskTypesAsItems } from '../../../../client/store/selectors/riskTypes';
import { getRiskGuidelines } from '../../../../client/store/selectors/organizations';

export default connect((state, { standardId }) => ({
  users: getSortedUsersByFirstNameAsItems(state),
  types: getRiskTypesAsItems(state),
  guidelines: getRiskGuidelines(state),
  standard: state.collections.standardsByIds[standardId],
}))(RiskSubcardAddNew);
