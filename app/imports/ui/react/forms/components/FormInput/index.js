import React, { PropTypes } from 'react';
import cx from 'classnames';
import { withHandlers } from 'recompose';

import TextInput from '../TextInput';
import { onHandleBlur } from './handlers';

const enhance = withHandlers({ onHandleBlur });

const FormInput = enhance(({ className, value, onHandleBlur: onBlur, ...other }) => (
  <TextInput className={cx('form-control', className)} {...{ ...other, onBlur, value }} />
));

FormInput.propTypes = {
  className: PropTypes.string,
  onBlur: PropTypes.func,
  value: PropTypes.string.isRequired,
};

export default FormInput;
