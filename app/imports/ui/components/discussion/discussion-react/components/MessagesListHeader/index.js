import React from 'react';
import { getStartedAtText, getStartedByText } from './constants';

const MessagesListHeader = ({ discussion }) => (
  <div className="chat-item chat-item-start">
    <p className="chat-item-text">
      This discussion was started by
      <strong> {getStartedByText(discussion)} </strong>
      on
      <strong> {getStartedAtText(discussion)}</strong>
    </p>
  </div>
);

export default MessagesListHeader;
