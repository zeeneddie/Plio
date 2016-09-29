import React from 'react';
import { withProps } from 'recompose';

import Message from '../Message';
import { transformMessages } from './constants.js';
import { transsoc } from '/imports/api/helpers.js';

const MessagesList = (props) => (
  <div>
    {props.messages.map(message =>
      <Message
        key={message._id}
        at={props.at}
        dispatch={props.dispatch}
        {...message} />)}
  </div>
);

export default withProps(transsoc({
  messages: transformMessages
}))(MessagesList);
