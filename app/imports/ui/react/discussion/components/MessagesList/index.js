import React from 'react';

import MessageContainer from '../../containers/MessageContainer';

const MessagesList = (props) => (
  <div>
    {props.messages.map(message =>
      <MessageContainer
        key={message._id}
        at={props.at}
        dispatch={props.dispatch}
        {...message} />)}
  </div>
);

export default MessagesList;
