import React from 'react';

import { EntityManagerForm } from '../../components';
import ActionAddContainer from '../containers/ActionAddContainer';

const ActionAddFormWrapper = props => (
  <ActionAddContainer
    {...props}
    component={EntityManagerForm}
  />
);

export default ActionAddFormWrapper;
