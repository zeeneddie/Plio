import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const MessageContent = ({ className, children, ...other }) => (
  <div className={cx('chat-item-content', className)} {...other}>
    {children}
  </div>
);

MessageContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MessageContent;
