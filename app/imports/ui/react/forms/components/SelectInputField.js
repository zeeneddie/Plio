import React from 'react';
import { Field } from 'react-final-form';

import SelectInputAdapter from './SelectInputAdapter';

const SelectInputField = props => (
  <Field
    component={SelectInputAdapter}
    {...props}
  />
);

export default SelectInputField;
