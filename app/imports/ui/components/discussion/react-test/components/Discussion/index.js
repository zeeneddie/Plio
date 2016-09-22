import React from 'react';

import MessagesListContainer from '../../containers/MessagesListContainer';
import MessagesFormContainer from '../../containers/MessagesFormContainer';

const Discussion = (props) => (
  <div className="chat">
    <MessagesListContainer {...props}/>
    <MessagesFormContainer {...props}/>
  </div>
);

export default Discussion;
