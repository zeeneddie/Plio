import React from 'react';
import { withProps } from 'recompose';

import MessageWrapper from '../MessageWrapper';
import { transformMessages } from './helpers.js';
import { transsoc } from '/imports/api/helpers.js';

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

export default withProps(transsoc({
  messages: transformMessages
}))(MessagesList);
