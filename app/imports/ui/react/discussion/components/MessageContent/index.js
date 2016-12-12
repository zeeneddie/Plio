import React from 'react';

const MessageContent = ({ onClick, contents }) => (
  <div className="chat-item-content" onClick={onClick}>{contents}</div>
);

export default MessageContent;
