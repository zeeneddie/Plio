import React from 'react';

const MessageTime = (props) => (
  <a className="chat-item-time" href={props.href} onClick={props.onClick}>{props.time}</a>
);

export default MessageTime;
