import React from 'react';
import { getClassName } from './constants.js';

const MessageBox = (props) => (
  <div className={`chat-item message ${getClassName(props)}`}>
    {props.children}
  </div>
);

export default MessageBox;
