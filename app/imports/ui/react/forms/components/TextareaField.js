import React from 'react';
import { Field } from 'react-final-form';

import TextareaAdapter from './TextareaAdapter';

const TextareaField = props => (
  <Field
    component={TextareaAdapter}
    {...props}
  />
);

export default TextareaField;
