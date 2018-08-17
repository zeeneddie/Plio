import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const MessageAuthor = ({ children, className, ...other }) => (
  <span className={cx('chat-item-author', className)} {...other}>
    {children}
  </span>
);

MessageAuthor.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MessageAuthor;
