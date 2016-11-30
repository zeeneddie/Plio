import React from 'react';

import propTypes from './propTypes';

const UnreadMessagesLabel = (props) => (
  <span
    className="label label-danger label-chat-count margin-left"
  >
    {props.unreadMessagesCount}
  </span>
);

UnreadMessagesLabel.propTypes = propTypes;

export default UnreadMessagesLabel;
