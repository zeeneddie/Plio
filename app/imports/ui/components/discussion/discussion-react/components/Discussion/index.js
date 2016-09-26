import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

import MessagesListContainer from '../../containers/MessagesListContainer';
import MessagesForm from '../../components/MessagesForm';
import DiscussionFileUploader from '../../components/DiscussionFileUploader';

const Discussion = (props) => (
  <div className="card chat">
    <Blaze template="Discussion_Header"/>
    <MessagesListContainer {...props}/>
    <MessagesForm {...props}>
      <DiscussionFileUploader {...props}/>
    </MessagesForm>
  </div>
);

export default Discussion;
