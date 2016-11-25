import React from 'react';

import propTypes from './propTypes';

const PreloaderButton = ({ size = 'md' }) => (
  <a className={`btn btn-${size} btn-secondary disabled`}>
    <i className="fa fa-spinner fa-spin margin-right"></i>
    Loading...
  </a>
);

PreloaderButton.propTypes = propTypes;

export default PreloaderButton;
