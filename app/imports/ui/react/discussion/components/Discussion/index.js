import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import PreloaderPage from '../../../components/PreloaderPage';
import MessagesListWrapperContainer from '../../containers/MessagesListWrapperContainer';
import MessagesFormContainer from '../../containers/MessagesFormContainer';
import DiscussionFileUploaderContainer from '../../containers/DiscussionFileUploaderContainer';
import CardHeader from '../../../components/CardHeader';
import Button from '../../../components/Button';
import Wrapper from '../../../components/Wrapper';
import Icon from '../../../components/Icon';

const Discussion = (props) => {
  const documentPath = FlowRouter.current().path.replace('/discussion', '');

  console.log(props)
  
  return !props.discussion ? (
    <PreloaderPage />
  ) : (
    <Wrapper className="content-cards-inner flexbox-column">
      <Wrapper className="card chat">
        <CardHeader className="chat-heading">
          <Wrapper className="discussions-hd-top">
            <CardHeader.Item pull="left" className="card-heading-buttons">
              <Button type="secondary" href={documentPath}>
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
    </Wrapper>
  );
};

export default Discussion;
