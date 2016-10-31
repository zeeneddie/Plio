import React from 'react';

import MessageWrapper from '../MessageWrapper';

const MessagesList = (props) => (
  <div>
    {props.messages.map(message =>
      <MessageWrapper
        key={message._id}
        at={props.at}
        dispatch={props.dispatch}
        {...message} />)}
  </div>
);

export default MessagesList;
