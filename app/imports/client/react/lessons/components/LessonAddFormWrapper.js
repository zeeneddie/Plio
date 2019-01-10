import React from 'react';

import { EntityManagerForm } from '../../components';
import LessonAddContainer from '../containers/LessonAddContainer';

const LessonAddFormWrapper = props => (
  <LessonAddContainer
    {...props}
    component={EntityManagerForm}
  />
);

export default LessonAddFormWrapper;
