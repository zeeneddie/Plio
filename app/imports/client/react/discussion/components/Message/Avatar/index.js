import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const MessageAvatar = ({
  tag = 'a', className, children, ...other
}) => {
  const Tag = tag;

  return (
    <Tag className={cx('chat-item-avatar img-wrapper sm', className)} {...other}>
      {children}
    </Tag>
  );
};

MessageAvatar.propTypes = {
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MessageAvatar;
