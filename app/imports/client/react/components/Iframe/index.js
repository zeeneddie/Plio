import React from 'react';

import propTypes from './propTypes';
import defer from '../../helpers/defer';

const Iframe = ({
  width = 560,
  height = 315,
  allowFullScreen = true,
  src = null,
  frameBorder = 0,
  ...other
}) => (
  <iframe
    {...{
      width, height, src, frameBorder, allowFullScreen, ...other,
    }}
  />
);

Iframe.propTypes = propTypes;

export default defer(Iframe);
