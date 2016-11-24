import React from 'react';
import Blaze from 'meteor/blaze-react-component';

import PreloaderPage from '../../../components/PreloaderPage';
import MessagesListWrapperContainer from '../../containers/MessagesListWrapperContainer';
import MessagesFormContainer from '../../containers/MessagesFormContainer';
import DiscussionFileUploaderContainer from '../../containers/DiscussionFileUploaderContainer';
import CardHeader from '../../../components/CardHeader';
import Button from '../../../components/Button';
import Wrapper from '../../../components/Wrapper';
import Icon from '../../../components/Icon';

const getDocumentPath = props =>
  props.pathToDiscussion.replace('/discussion', '');

const Discussion = (props) => {
  return !props.discussion ? (
    <PreloaderPage />
  ) : (
    <Wrapper className="card chat">
      <CardHeader className="chat-heading">
        <Wrapper className="discussions-hd-top">
          <CardHeader.Item pull="left" className="card-heading-buttons">
            <Button type="secondary" href={getDocumentPath(props)}>
              <Icon name="angle-left" margin="right" />
              Back
            </Button>
          </CardHeader.Item>
          <CardHeader.Title>
            Discussion
          </CardHeader.Title>
        </Wrapper>
      </CardHeader>
      <MessagesListWrapperContainer {...props} />
      <MessagesFormContainer {...props}>
        <DiscussionFileUploaderContainer {...props} />
      </MessagesFormContainer>
    </Wrapper>
  );
};

export default Discussion;
