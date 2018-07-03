import React from 'react';
import { Field } from 'react-final-form';

import SwitchViewAdapter from './SwitchViewAdapter';

const SwitchViewField = props => (
  <Field
    {...props}
    component={SwitchViewAdapter}
  />
);

export default SwitchViewField;
