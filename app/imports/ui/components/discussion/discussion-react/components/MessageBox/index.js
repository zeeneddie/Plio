import React from 'react';

const MessageBox = (props) => (
  <div className={`chat-item message ${props.className}`}>
    {props.children}
  </div>
);

export default MessageBox;
