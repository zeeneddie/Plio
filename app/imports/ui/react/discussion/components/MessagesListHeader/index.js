import React from 'react';

const MessagesListHeader = ({ startedAt, startedBy }) => (
  <div className="chat-item chat-item-start">
    <p className="chat-item-text">
      This discussion was started by
      <strong> {startedBy} </strong>
      on
      <strong> {startedAt}</strong>
    </p>
  </div>
);

export default MessagesListHeader;
