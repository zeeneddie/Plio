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
  children,
  onHandleBlur: onBlur,
  onHandleClear: onClear,
  ...other,
}) => {
  let textInput;

  return (
    <ClearField onClick={e => onClear(e)(textInput)}>
      <div className={cx(!!children && 'input-group')}>
        {children}
        <TextInput
          className={cx('form-control', className)}
          refCb={input => (textInput = input)}
          {...{ ...other, onBlur, value }}
        />
      </div>
    </ClearField>
  );
});

FormInput.propTypes = {
  className: PropTypes.string,
  onBlur: PropTypes.func,
  value: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default FormInput;
