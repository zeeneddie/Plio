import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';

import LoadableDatePicker from '../../components/LoadableDatePicker';

const renderDatePicker = ({ input: { value, ...input }, onChange, ...rest }) => (
  <LoadableDatePicker
    {...{ ...input, ...rest }}
    selected={value}
    onChange={(momentDate) => {
      input.onChange(momentDate);
      if (onChange) {
        onChange(momentDate);
      }
    }}
  />
);

renderDatePicker.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

const DatePickerField = props => (
  <Field
    {...props}
    component={renderDatePicker}
  />
);

export default DatePickerField;
