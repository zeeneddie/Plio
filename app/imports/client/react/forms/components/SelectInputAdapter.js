import PropTypes from 'prop-types';
import React from 'react';
import { append, difference } from 'ramda';

import SelectInput from './SelectInput';

const SelectInputAdapter = ({
  input,
  onChange,
  onSelect,
  onDelete,
  onNewOptionClick,
  ...rest
}) => (
  <SelectInput
    {...{ ...input, ...rest }}
    onChange={(option) => {
      const selectedValue = difference(option, input.value)[0];
      const deletedValue = difference(input.value, option)[0];

      input.onChange(option);

      if (onChange) onChange(option);
      if (onSelect && selectedValue) onSelect(selectedValue);
      if (onDelete && deletedValue) onDelete(deletedValue);
    }}
    onNewOptionClick={(rawOption) => {
      if (onNewOptionClick) {
        onNewOptionClick(rawOption, (option) => {
          const options = rest.multi ? append(option, input.value) : option;
          input.onChange(options);
          if (onChange) onChange(options);
        });
      }
    }}
  />
);

SelectInputAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
  onNewOptionClick: PropTypes.func,
};

export default SelectInputAdapter;
