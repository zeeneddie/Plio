import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const MessageTime = ({ className, children, ...other }) => (
  <a className={cx('chat-item-time', className)} {...other}>
    {children}
  </a>
);

MessageTime.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MessageTime;
