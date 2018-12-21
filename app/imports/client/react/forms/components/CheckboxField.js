import React from 'react';
import { Field } from 'react-final-form';

import CheckboxAdapter from './CheckboxAdapter';

const CheckboxField = props => (
  <Field
    component={CheckboxAdapter}
    {...props}
  />
);

export default CheckboxField;
