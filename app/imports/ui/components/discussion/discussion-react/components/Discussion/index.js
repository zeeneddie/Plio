import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

import MessagesListContainer from '../../containers/MessagesListContainer';
import MessagesForm from '../../components/MessagesForm';

const Discussion = (props) => (
  <div className="card chat">
    <Blaze template="Discussion_Header"/>
    <MessagesListContainer {...props}/>
    <MessagesForm {...props}/>
  </div>
);

export default Discussion;
