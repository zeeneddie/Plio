import React from 'react';
import { Field } from 'react-final-form';

import DatePickerAdapter from './DatePickerAdapter';

const DatePickerField = props => (
  <Field
    {...props}
    component={DatePickerAdapter}
  />
);

export default DatePickerField;
