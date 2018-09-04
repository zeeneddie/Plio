import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const MessageContainer = ({ className, children, ...other }) => (
  <div className={cx('chat-message-container', className)} {...other}>
    {children}
  </div>
);

MessageContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MessageContainer;
