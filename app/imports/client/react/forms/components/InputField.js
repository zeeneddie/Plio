import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';

import { parseInputValue } from '../helpers';
import InputAdapter from './InputAdapter';
import FormInput from './FormInput';

const renderInput = props => <InputAdapter component={FormInput} {...props} />;

const InputField = props => (
  <Field
    component={renderInput}
    parse={(value) => {
      const { type, min, max } = props;

      return parseInputValue({
        value,
        type,
        min,
        max,
      });
    }}
    {...props}
  />
);

InputField.propTypes = {
  type: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default InputField;
