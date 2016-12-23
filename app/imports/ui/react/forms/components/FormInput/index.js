import React, { PropTypes } from 'react';
import { withHandlers } from 'recompose';

import TextInput from '../TextInput';
import ClearField from '../../../fields/read/components/ClearField';
import { onHandleBlur, onHandleClear } from './handlers';

const enhance = withHandlers({ onHandleBlur, onHandleClear });

const FormInput = enhance(({
  value,
  onHandleBlur: onBlur,
  onHandleClear: onClear,
  ...other,
}) => {
  let textInput;

  return (
    <ClearField onClick={e => onClear(e)(textInput)}>
      <TextInput
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
