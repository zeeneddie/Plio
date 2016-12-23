/* eslint-disable no-unused-vars */

import React, { PropTypes } from 'react';
import cx from 'classnames';
import { compose, withState, lifecycle } from 'recompose';
import property from 'lodash.property';

const enhance = compose(
  withState('internalValue', 'setInternalValue', property('value')),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value) {
        nextProps.setInternalValue(nextProps.value);
      }
    },
  }),
);

const TextInput = enhance(({
  value,
  internalValue,
  onChange,
  setInternalValue,
  className,
  refCb = () => null,
  ...other,
}) => (
  <input
    type="text"
    value={internalValue}
    onChange={(e) => {
      setInternalValue(e.target.value);

      return typeof onChange === 'function' && onChange(e);
    }}
    ref={refCb}
    className={cx('form-control', className)}
    {...other}
  />
));

TextInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  refCb: PropTypes.func,
  className: PropTypes.string,
};

export default TextInput;
