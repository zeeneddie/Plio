import PropTypes from 'prop-types';
import React from 'react';

import SelectInput from './SelectInput';

const SelectInputAdapter = ({ input, onChange, ...rest }) => (
  <SelectInput
    {...{ ...input, ...rest }}
    onChange={(value) => {
      input.onChange(value);
      if (onChange) onChange(value);
    }}
  />
);

SelectInputAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

export default SelectInputAdapter;
