import React from 'react';

import { EntityManagerForm } from '../../components';
import GuidanceAddContainer from '../containers/GuidanceAddContainer';

const GuidanceAddFormWrapper = props => (
  <GuidanceAddContainer
    {...props}
    component={EntityManagerForm}
  />
);

export default GuidanceAddFormWrapper;
