import React, { PropTypes } from 'react';
import cx from 'classnames';
import { withHandlers } from 'recompose';

import TextInput from '../TextInput';
import ClearField from '../../../fields/read/components/ClearField';
import { onHandleBlur, onHandleClear } from './handlers';

const enhance = withHandlers({ onHandleBlur, onHandleClear });

const FormInput = enhance(({
  className,
  value,
  onHandleBlur: onBlur,
  onHandleClear: onClear,
  ...other,
}) => {
  let textInput;

  return (
    <ClearField onClick={e => onClear(e)(textInput)}>
      <TextInput
        className={cx('form-control', className)}
        refCb={input => (textInput = input)}
        {...{ ...other, onBlur, value }}
      />
    </ClearField>
  );
});

FormInput.propTypes = {
  className: PropTypes.string,
  onBlur: PropTypes.func,
  value: PropTypes.string.isRequired,
};

export default FormInput;
