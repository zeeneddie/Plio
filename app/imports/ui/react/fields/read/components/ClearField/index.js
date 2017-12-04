import React from 'react';
import cx from 'classnames';

import ClearButton from '../../../../components/Buttons/ClearButton';
import propTypes from './propTypes';

const ClearField = ({
  isFocused, animating, onClick, children, 
}) => (
  <div className={cx('clearable-field-container', { focused: isFocused })}>
    {children}
    <ClearButton
      animating={animating}
      onClick={onClick}
    />
  </div>
);

ClearField.propTypes = propTypes;

export default ClearField;
