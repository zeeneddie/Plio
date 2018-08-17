import PropTypes from 'prop-types';
import React from 'react';

import SelectRadio from './SelectRadio';

const SelectRadioAdapter = ({
  input,
  onChange,
  ...rest
}) => (
  <SelectRadio
    {...{ ...input, ...rest }}
    onChange={(option) => {
      input.onChange(option.value);
      if (onChange && option.value !== input.value) onChange(option);
    }}
  />
);

SelectRadioAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
  meta: PropTypes.object,
};

export default SelectRadioAdapter;
