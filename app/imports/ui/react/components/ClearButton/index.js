import React from 'react';

import propTypes from './propTypes';

const ClearButton = (props) => (
  <button type="button" className="btn btn-link clear-field" tabIndex="-1" onClick={props.onClick}>
    {props.animating ? (
      <i className="fa fa-spinner fa-pulse fa-fw margin-bottom"></i>
    ) : (
      <i className="fa fa-times-circle"></i>
    )}
  </button>
);

ClearButton.propTypes = propTypes;

export default ClearButton;
