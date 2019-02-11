import PropTypes from 'prop-types';
import React from 'react';

import Checkbox from './Checkbox';

const CheckboxAdapter = ({
  input,
  onChange,
  ...rest
}) => (
  <Checkbox
    {...rest}
    checked={input.value || false}
    onChange={(checked) => {
      input.onChange(checked);
      if (onChange) onChange(checked);
    }}
  />
);

CheckboxAdapter.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  component: PropTypes.elementType,
};

export default CheckboxAdapter;
