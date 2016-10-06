import React from 'react';
import Blaze from 'meteor/blaze-react-component';

import MessagesListWrapperContainer from '../../containers/MessagesListWrapperContainer';
import MessagesFormContainer from '../../containers/MessagesFormContainer';
import DiscussionFileUploader from '../../components/DiscussionFileUploader';

const Discussion = (props) => (
  <div className="card chat">
    <Blaze template="Discussion_Header"/>
    <MessagesListWrapperContainer {...props}/>
    <MessagesFormContainer {...props}>
      <DiscussionFileUploader {...props}/>
    </MessagesFormContainer>
  </div>
);

export default Discussion;
