import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

import MessagesListContainer from '../../containers/MessagesListContainer';
import MessagesFormContainer from '../../containers/MessagesFormContainer';

const Discussion = (props) => (
  <div className="card chat">
    <Blaze template="Discussion_Header"/>
    <MessagesListContainer {...props}/>
    <MessagesFormContainer {...props}/>
  </div>
);

export default Discussion;
