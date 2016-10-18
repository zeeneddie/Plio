import React from 'react';

const MessageCard = (props) => (
  <div className="chat-item-card">
    {props.children}
  </div>
);

export default MessageCard;
