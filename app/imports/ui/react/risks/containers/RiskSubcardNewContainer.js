import { connect } from 'react-redux';

import withRiskFormFields from './withRiskFormFields';
import { namedCompose } from '../../helpers';
import { getUserId } from '../../../../client/store/selectors/global';
import RiskSubcardNew from '../components/RiskSubcardNew';
import { getRiskTypesAsItems } from '../../../../client/store/selectors/riskTypes';

export default namedCompose('RiskSubcardNewContainer')(
  connect(state => ({
    userId: getUserId(state),
    types: getRiskTypesAsItems(state),
  })),
  withRiskFormFields,
)(RiskSubcardNew);
