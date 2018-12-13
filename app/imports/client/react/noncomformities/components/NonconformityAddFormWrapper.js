import React from 'react';

import { EntityManagerForm } from '../../components';
import NonconformityAddContainer from '../containers/NonconformityAddContainer';

const NonconformityAddFormWrapper = props => (
  <NonconformityAddContainer
    {...props}
    component={EntityManagerForm}
  />
);

export default NonconformityAddFormWrapper;
