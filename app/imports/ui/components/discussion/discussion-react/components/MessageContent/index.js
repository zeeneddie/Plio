import React from 'react';

const MessageContent = (props) => (
  <p className="chat-item-content" onClick={props.onClick}>{props.contents}</p>
);

export default MessageContent;
