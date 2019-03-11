import React from 'react';

import { EntityManagerForm } from '../../components';
import ReviewAddContainer from '../containers/ReviewAddContainer';

const ReviewAddFormWrapper = props => (
  <ReviewAddContainer
    {...props}
    component={EntityManagerForm}
  />
);

export default ReviewAddFormWrapper;
