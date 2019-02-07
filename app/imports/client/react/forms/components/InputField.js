import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';

import InputAdapter from './InputAdapter';
import FormInput from './FormInput';

const renderInput = props => <InputAdapter component={FormInput} {...props} />;

const InputField = props => (
  <Field
    component={renderInput}
    parse={(inputValue) => {
      if (inputValue === '') return undefined;

      let value = inputValue;
      const {
        type,
        min,
        max,
      } = props;

      if (type === 'number') {
        value = Number(value);

        if (max && value > max) return max;

        if (min && value < min) return min;
      }

      return value;
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
