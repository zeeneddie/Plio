import React from 'react';

import PreloaderPage from '../../../components/PreloaderPage';
import MessagesListWrapperContainer from '../../containers/MessagesListWrapperContainer';
import MessagesFormContainer from '../../containers/MessagesFormContainer';
import DiscussionFileUploaderContainer from '../../containers/DiscussionFileUploaderContainer';
import CardHeader from '../../../components/CardHeader';
import Button from '../../../components/Buttons/Button';
import Wrapper from '../../../components/Wrapper';
import Icon from '../../../components/Icon';

const Discussion = (props) => (
  <Wrapper className="content-cards-inner flexbox-column">
    <Wrapper className="card chat">
      <CardHeader className="chat-heading">
        <Wrapper className="discussions-hd-top">
          <CardHeader.Item pull="left" className="card-heading-buttons">
            <Button type="secondary" onClick={props.onBackArrowClick}>
              <Icon names="angle-left" margin="right-2x" size="2" />
              <span>Back</span>
            </Button>
          </CardHeader.Item>
          <CardHeader.Title>
            Discussion
          </CardHeader.Title>
        </Wrapper>
      </CardHeader>
      {props.discussion ? (
        <MessagesListWrapperContainer {...props} />
      ) : (
        <PreloaderPage />
      )}
      <MessagesFormContainer {...props}>
        <DiscussionFileUploaderContainer {...props} />
      </MessagesFormContainer>
    </Wrapper>
  </Wrapper>
);

export default Discussion;
