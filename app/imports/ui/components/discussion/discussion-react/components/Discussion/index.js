import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

import MessagesListWrapperContainer from '../../containers/MessagesListWrapperContainer';
import MessagesForm from '../../components/MessagesForm';
import DiscussionFileUploader from '../../components/DiscussionFileUploader';

const Discussion = (props) => (
  <div className="card chat">
    <Blaze template="Discussion_Header"/>
    <MessagesListWrapperContainer {...props}/>
    <MessagesForm {...props}>
      <DiscussionFileUploader {...props}/>
    </MessagesForm>
  </div>
);

export default Discussion;
