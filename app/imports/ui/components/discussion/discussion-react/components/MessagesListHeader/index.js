import React from 'react';
import { getStartedAtText, getStartedByText } from './constants';
import { mapProps } from 'recompose';
import { transsoc } from '/imports/api/helpers.js';

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

export default mapProps(transsoc({
  startedBy: getStartedByText,
  startedAt: getStartedAtText
}))(MessagesListHeader);
