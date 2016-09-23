import React from 'react';

import Message from '../Message';
import { transformMessages } from './constants.js';

const MessagesList = ({ messages, discussion }) => (
  <div>
    {transformMessages({ messages, discussion })
      .map(message => <Message key={message._id} {...message} />)}
  </div>
);

export default MessagesList;
