import React from 'react';
import property from 'lodash.property';

const Message = (props) => (
  <div className="chat-message-container">
    <p className="chat-item-content">
      {props.text}
    </p>
  </div>
);

export default Message;
