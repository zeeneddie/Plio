import PropTypes from 'prop-types';
import React from 'react';

import Preloader from '../Preloader';

const PreloaderPage = ({ size = 4, ...props } = {}) => (
  <div className="preloader vertical-center table" {...props}>
    <div className="table-cell text-xs-center">
      <Preloader {...{ size }} />
    </div>
  </div>
);

PreloaderPage.propTypes = {
  size: PropTypes.number,
};

export default PreloaderPage;
