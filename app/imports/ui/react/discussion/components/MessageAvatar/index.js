import React, { PropTypes } from 'react';

const MessageAvatar = ({ avatar, alt, onClick, tag = 'a', ...other }) => {
  const Tag = tag;

  return (
    <Tag {...{ ...other, onClick }} className="chat-item-avatar img-wrapper sm">
      <img tabIndex="0" src={avatar} alt={alt} />
    </Tag>
  );
};

MessageAvatar.propTypes = {
  avatar: PropTypes.string.isRequired,
  alt: PropTypes.string,
  tag: PropTypes.string,
  onClick: PropTypes.func,
};

export default MessageAvatar;
