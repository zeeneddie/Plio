import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const MessageBox = ({ className, children, ...other }) => (
  <div className={cx('chat-item message', className)} {...other}>
    {children}
  </div>
);

MessageBox.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MessageBox;
