import React, { PropTypes } from 'react';
import { withHandlers } from 'recompose';
import cx from 'classnames';
import { DebounceInput } from 'react-debounce-input';

import ClearField from '../../../fields/read/components/ClearField';
import { onHandleBlur, onHandleClear } from './handlers';

const enhance = withHandlers({ onHandleBlur, onHandleClear });

const FormInput = enhance(({
  value,
  className,
  children,
  onHandleBlur: onBlur,
  onHandleClear: onClear,
  onChange,
  debounceTimeout,
  ...other
}) => {
  let textInput;

  return (
    <ClearField onClick={e => onClear(e)(textInput)}>
      <DebounceInput
        className={cx('form-control', className)}
        {...{
          value,
          onChange,
          onBlur,
          debounceTimeout,
          ...other,
        }}
      />
    </ClearField>
  );
});

FormInput.propTypes = {
  className: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string.isRequired,
  debounceTimeout: PropTypes.number,
  children: PropTypes.node,
};

export default FormInput;
