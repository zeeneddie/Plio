import React from 'react';

import propTypes from './propTypes';

const ToggleExpandButton = (props) => (
  <a
    className="btn btn-secondary toggle-expand-btn"
    onClick={props.onClick}
  ></a>
);

ToggleExpandButton.propTypes = propTypes;

export default ToggleExpandButton;
