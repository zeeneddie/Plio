import React, { PropTypes } from 'react';

import PreloaderButton from '../../PreloaderButton';

const RHSHeader = ({ title, isReady = true, children }) => (
  <div className="card-block card-heading">
    <div className="card-heading-buttons pull-xs-right">
      {isReady ? children : (<PreloaderButton />)}
    </div>
    <h3 className="card-title">
      {title}
    </h3>
  </div>
);

RHSHeader.propTypes = {
  title: PropTypes.string,
  isReady: PropTypes.bool,
  children: PropTypes.node,
};

export default RHSHeader;
