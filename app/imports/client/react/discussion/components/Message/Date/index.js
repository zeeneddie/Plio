import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const MessageDate = ({ className, children, ...other }) => (
  <div className={cx('chat-item-date', className)} {...other}>
    <span>{children}</span>
  </div>
);

MessageDate.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MessageDate;
