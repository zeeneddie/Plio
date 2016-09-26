import React from 'react';
import { mapProps } from 'recompose';

import Message from '../Message';
import { transformMessages } from './constants.js';
import { transsoc } from '/imports/api/helpers.js';

const MessagesList = (props) => (
  <div>
    {props.messages.map(message => <Message key={message._id} {...message} />)}
  </div>
);

export default mapProps(transsoc({
  messages: transformMessages
}))(MessagesList);
