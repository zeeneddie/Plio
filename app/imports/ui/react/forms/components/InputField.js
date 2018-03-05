import React from 'react';
import { Field } from 'react-final-form';

import InputAdapter from './InputAdapter';
import FormInput from './FormInput';

const renderInput = props => <InputAdapter component={FormInput} {...props} />;

const InputField = props => (
  <Field
    component={renderInput}
    {...props}
  />
);

export default InputField;
