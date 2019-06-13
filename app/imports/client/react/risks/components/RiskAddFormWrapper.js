import React from 'react';

import { EntityManagerForm } from '../../components';
import RiskAddContainer from '../containers/RiskAddContainer';

const RiskAddFormWrapper = props => (
  <RiskAddContainer
    {...props}
    component={EntityManagerForm}
  />
);

export default RiskAddFormWrapper;
