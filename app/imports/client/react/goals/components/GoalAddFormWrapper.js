import React from 'react';

import { EntityManagerForm } from '../../components';
import GoalAddContainer from '../containers/GoalAddContainer';

const GoalAddFormWrapper = props => (
  <GoalAddContainer
    {...props}
    component={EntityManagerForm}
  />
);

export default GoalAddFormWrapper;
