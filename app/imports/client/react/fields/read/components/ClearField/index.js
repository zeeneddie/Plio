import React from 'react';
import cx from 'classnames';

import ClearButton from '../../../../components/Buttons/ClearButton';
import propTypes from './propTypes';

const ClearField = ({
  isFocused,
  animating,
  onClick,
  children,
  className,
  tag: Tag = 'div',
  ...props
}) => (
  <Tag
    className={cx('clearable-field-container', { focused: isFocused }, className)}
    {...props}
  >
    {children}
    <ClearButton
      animating={animating}
      onClick={onClick}
    />
  </Tag>
);

ClearField.propTypes = propTypes;

export default ClearField;
