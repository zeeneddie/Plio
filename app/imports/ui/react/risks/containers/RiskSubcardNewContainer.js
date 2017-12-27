import { connect } from 'react-redux';

import withRiskFormFields from './withRiskFormFields';
import { namedCompose } from '../../helpers';
import { getUserId } from '../../../../client/store/selectors/global';
import { getRiskTypes } from '../../../../client/store/selectors/riskTypes';
import RiskSubcardNew from '../components/RiskSubcardNew';

export default namedCompose('RiskSubcardNewContainer')(
  connect(state => ({
    userId: getUserId(state),
    types: getRiskTypes(state),
  })),
  withRiskFormFields,
)(RiskSubcardNew);
