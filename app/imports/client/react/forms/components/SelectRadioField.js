import React from 'react';
import { Field } from 'react-final-form';

import SelectRadioAdapter from './SelectRadioAdapter';

const SelectRadioField = props => (
  <Field
    component={SelectRadioAdapter}
    {...props}
  />
);

export default SelectRadioField;
