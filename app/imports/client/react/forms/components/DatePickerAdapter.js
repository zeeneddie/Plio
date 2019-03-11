import PropTypes from 'prop-types';
import React from 'react';

import LoadableDatePicker from '../../components/LoadableDatePicker';

const DatePickerAdapter = ({ input: { value, ...input }, onChange, ...rest }) => (
  <LoadableDatePicker
    {...{ ...input, ...rest }}
    selected={value}
    onChange={(momentDate) => {
      input.onChange(+momentDate || null);
      if (onChange) {
        onChange(+momentDate);
      }
    }}
  />
);

DatePickerAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

export default DatePickerAdapter;
