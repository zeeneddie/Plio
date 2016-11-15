import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';

const Iframe = ({
  width = 560,
  height = 315,
  allowFullScreen = true,
  src = null,
  frameBorder = 0,
  className = '',
}) => (
  <div className={cx(className, 'iframe-wrapper')}>
    <div className="iframe-placeholder"></div>
    <iframe
      width={width}
      height={height}
      allowFullScreen={allowFullScreen}
      src={src}
      frameBorder={frameBorder}
    >
    </iframe>
  </div>
);

Iframe.propTypes = propTypes;

export default Iframe;
