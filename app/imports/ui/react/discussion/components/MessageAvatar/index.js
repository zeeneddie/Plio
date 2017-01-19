import React, { PropTypes } from 'react';

const MessageAvatar = ({ tag = 'a', children, ...other }) => {
  const Tag = tag;

  return (
    <Tag {...{ ...other }} className="chat-item-avatar img-wrapper sm">
      {children}
    </Tag>
  );
};

MessageAvatar.propTypes = {
  tag: PropTypes.string,
  children: PropTypes.node,
};

export default MessageAvatar;
