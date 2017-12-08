import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';

const IframeWrapper = ({ className, children }) => (
  <div className={cx(className, 'iframe-wrapper')}>
    <div className="iframe-placeholder" />
    {children}
  </div>
);

IframeWrapper.propTypes = propTypes;

export default IframeWrapper;
