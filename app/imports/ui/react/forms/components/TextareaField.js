import React from 'react';
import { Field } from 'react-final-form';

import InputAdapter from './InputAdapter';

const TextareaField = props => (
  <Field
    type="textarea"
    rows={3}
    component={InputAdapter}
    {...props}
  />
);

export default TextareaField;
