import React, { PropTypes } from 'react';

import Preloader from '../Preloader';

const PreloaderPage = ({ size = 4 }) => (
  <div className="preloader vertical-center table">
    <div className="table-cell text-xs-center">
      <Preloader {...{ size }} />
    </div>
  </div>
);

PreloaderPage.propTypes = {
  size: PropTypes.number,
};

export default PreloaderPage;
