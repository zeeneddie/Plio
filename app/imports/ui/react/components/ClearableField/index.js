import React from 'react';

import ClearButton from '../ClearButton';
import propTypes from './propTypes';

const ClearableField = (props) => (
  <div className={`clearable-field-container ${props.isFocused && 'focused'}`}>
    {props.children}
    <ClearButton
      animating={props.animating}
      onClick={props.onClick}
    />
  </div>
);

ClearableField.propTypes = propTypes;

export default ClearableField;
