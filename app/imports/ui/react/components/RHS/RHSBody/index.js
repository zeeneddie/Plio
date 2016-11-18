import React, { PropTypes } from 'react';

import PreloaderPage from '../../PreloaderPage';

const RHSBody = ({ isReady, children }) => isReady ? (
 <div className="content-list">
   {children}
 </div>
) : (
  <div className="m-t-3">
    <PreloaderPage size={2} />
  </div>
);

RHSBody.propTypes = {
  isReady: PropTypes.bool,
  children: PropTypes.node,
};

export default RHSBody;
