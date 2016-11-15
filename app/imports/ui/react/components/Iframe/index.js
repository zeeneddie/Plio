import React from 'react';

import propTypes from './propTypes';

const Iframe = ({
  width = 560,
  height = 315,
  allowFullScreen = true,
  src = null,
  frameBorder = 0,
}) => (
  <iframe
    width={width}
    height={height}
    allowFullScreen={allowFullScreen}
    src={src}
    frameBorder={frameBorder}
  >
  </iframe>
);

Iframe.propTypes = propTypes;

export default Iframe;
