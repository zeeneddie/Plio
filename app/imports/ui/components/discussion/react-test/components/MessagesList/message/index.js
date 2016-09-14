import React from 'react';

const Message = (props) => (
  <div className="chat-message-container">
    <p className="chat-item-content">
      {props.text}
    </p>
  </div>
);

export default Message;
