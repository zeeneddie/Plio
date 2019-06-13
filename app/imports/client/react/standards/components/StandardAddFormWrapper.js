import React from 'react';

import { EntityManagerForm } from '../../components';
import StandardAddContainer from '../containers/StandardAddContainer';

const StandardAddFormWrapper = props => (
  <StandardAddContainer
    {...props}
    component={EntityManagerForm}
  />
);

export default StandardAddFormWrapper;
