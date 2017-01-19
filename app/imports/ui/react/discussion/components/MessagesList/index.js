import React, { PropTypes } from 'react';

import MessageContainer from '../../containers/MessageContainer';

const MessagesList = ({ messages, at, dispatch }) => (
  <div>
    {messages.map((message) => (
      <MessageContainer key={message._id} {...{ ...message, at, dispatch }} />
    ))}
  </div>
);

MessagesList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  at: PropTypes.string,
  dispatch: PropTypes.func,
};

export default MessagesList;
