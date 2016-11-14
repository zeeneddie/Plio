import React from 'react';

const Iframe = ({
  width = 560,
  height = 315,
  allowFullScreen = 1,
  src = null,
  frameBorder = 0,
}) => (
  <div className="iframe-wrapper video">
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

export default Iframe;
