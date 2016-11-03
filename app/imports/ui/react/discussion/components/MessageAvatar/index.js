import React from 'react';

const MessageAvatar = (props) => (
  <a className="chat-item-avatar img-wrapper sm" role="button" onClick={props.onClick}>
    <img tabIndex="0" src={props.avatar} alt={props.alt} />
  </a>
);

export default MessageAvatar;
