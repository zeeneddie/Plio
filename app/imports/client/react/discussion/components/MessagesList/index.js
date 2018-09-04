import PropTypes from 'prop-types';
import React from 'react';

import MessageContainer from '../../containers/MessageContainer';

const MessagesList = ({
  messages, at, dispatch, userId,
}) => (
  <div>
    {messages.map(message => (
      <MessageContainer
        key={message._id}
        {...{
          ...message, at, dispatch, userId,
        }}
      />
    ))}
  </div>
);

MessagesList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  at: PropTypes.string,
  dispatch: PropTypes.func,
  userId: PropTypes.string,
};

export default MessagesList;
