import React from 'react';
import { compose, lifecycle, shallowEqual, withHandlers, withProps } from 'recompose';

import MessageDate from '../MessageDate';
import MessageBox from '../MessageBox';
import MessageAvatar from '../MessageAvatar';
import MessageCard from '../MessageCard';
import MessageAuthor from '../MessageAuthor';
import MessageTime from '../MessageTime';
import MessageGutter from '../MessageGutter';
import MessageContent from '../MessageContent';
import MessageMenu from '../MessageMenu';

import {
  isAuthor,
  getMessagePath,
  getUserAvatar,
  getUserFirstName,
  getUserFullNameOrEmail,
  getMessageTime,
  getMessageContents,
  getPathToMessageToCopy,
  getClassName,
  openUserDetails,
  deselect,
  remove
} from './constants.js';

import { transsoc } from '/imports/api/helpers.js';

const Message = (props) => {
  return (
    <div className="chat-message-container">
      {props.dateToShow && <MessageDate date={props.date} />}

      <MessageBox className={props.className}>
        {!props.isMergedWithPreviousMessage &&
          <MessageAvatar
            avatar={props.userAvatar}
            alt={props.userFullNameOrEmail}
            onClick={e => props.onMessageAvatarClick(e)} />}

          <MessageCard>
            {!props.isMergedWithPreviousMessage &&
              (<div>
                <MessageAuthor name={props.userFirstName}/>

                <MessageTime
                  href={props.pathToMessage}
                  time={props.time}/>
              </div>)}

            <MessageMenu
              isAuthor={props.isAuthor}
              pathToMessageToCopy={props.pathToMessageToCopy}
              delete={e => props.onMessageDelete(e)}/>

            <MessageGutter>
              <MessageTime
                href={props.pathToMessage}
                time={props.time}/>
            </MessageGutter>

            <MessageContent
              contents={props.contents}
              onClick={e => props.onMessageContentsClick(e)}/>
          </MessageCard>
      </MessageBox>
    </div>
  );
};

export default compose(
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return shallowEqual(this.props, nextProps);
    }
  }),
  withHandlers({
    onMessageAvatarClick: openUserDetails,
    onMessageContentsClick: deselect,
    onMessageDelete: remove
  }),
  withProps(transsoc({
    isAuthor,
    userAvatar: getUserAvatar,
    userFirstName: getUserFirstName,
    userFullNameOrEmail: getUserFullNameOrEmail,
    pathToMessage: getMessagePath,
    time: getMessageTime,
    contents: getMessageContents,
    pathToMessageToCopy: getPathToMessageToCopy,
    className: getClassName
  }))
)(Message);
