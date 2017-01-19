import React, { PropTypes } from 'react';
import cx from 'classnames';

const MessageGutter = ({ className, children, ...other }) => (
  <div className={cx('chat-item-gutter', className)} {...other}>
    {children}
  </div>
);

MessageGutter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MessageGutter;
