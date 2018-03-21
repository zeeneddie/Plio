import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';

import SelectInput from './SelectInput';

const renderSelectInput = ({ input, onChange, ...rest }) => (
  <SelectInput
    {...{ ...input, ...rest }}
    onChange={(value) => {
      input.onChange(value);
      if (onChange) onChange(value);
    }}
  />
);

renderSelectInput.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

const SelectInputField = props => (
  <Field
    component={renderSelectInput}
    {...props}
  />
);

export default SelectInputField;
