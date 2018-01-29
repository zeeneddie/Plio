import PropTypes from 'prop-types';
import React from 'react';
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
  inputRef,
  containerClassName,
  inputGroup,
  ...other
}) => {
  let textInput;

  return (
    <ClearField
      className={cx(containerClassName, { 'input-group': inputGroup })}
      onClick={e => onClear(e, textInput)}
    >
      {children}
      <DebounceInput
        className={cx('form-control', className)}
        inputRef={(input) => {
          textInput = input;
          return inputRef && inputRef(input);
        }}
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
  inputRef: PropTypes.func,
  children: PropTypes.node,
  inputGroup: PropTypes.bool,
};

export default FormInput;
