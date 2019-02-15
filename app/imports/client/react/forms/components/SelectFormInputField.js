import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import SelectInputField from './SelectInputField';
import FormInput from './FormInput';

const StyledSelectInputField = styled(SelectInputField)`
  .Select-loading-zone {
    right: 70px;
  }
`;

const SelectFormInputField = ({ onClear, ...props }) => (
  <StyledSelectInputField
    {...props}
    inputRenderer={({
      className,
      ref,
      onChange,
      ...rest
    }) => (
      <FormInput
        {...rest}
        innerRef={ref}
        containerClassName={className}
        onChange={(e) => {
          onChange(e);

          if (e.cleared) {
            if (onClear) onClear(e);
          }
        }}
      />
    )}
  />
);

SelectFormInputField.propTypes = {
  onClear: PropTypes.func,
};

export default SelectFormInputField;
