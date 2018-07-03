import PropTypes from 'prop-types';
import React from 'react';
import { getTargetValue } from 'plio-util';
import { Input } from 'reactstrap';

const InputAdapter = ({
  meta: { dirty },
  input,
  onChange,
  onBlur,
  component: Component = Input,
  ...rest
}) => (
  <Component
    {...{ ...input, ...rest }}
    onChange={(e) => {
      input.onChange(getTargetValue(e));
      if (onChange) onChange(e);
    }}
    onBlur={(e) => {
      input.onBlur(e);
      if (dirty && onBlur) {
        onBlur(e);
      }
    }}
  />
);

InputAdapter.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  component: PropTypes.func,
};

export default InputAdapter;
