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

import {
  openUserDetails,
  getMessagePath,
  getUserAvatar,
  getUserFirstName,
  getUserFullNameOrEmail,
  getMessageTime
} from './constants.js';

import { transsoc } from '/imports/api/helpers.js';

const Message = (props) => {
  return (
    <div className="chat-message-container">
      {props.dateToShow && <MessageDate date={props.date} />}

      <MessageBox {...props}>
        {!props.isMergedWithPreviousMessage &&
          <MessageAvatar
            avatar={props.userAvatar}
            alt={props.userFullNameOrEmail}
            onClick={e => props.openUserDetails(e)} />}

          <MessageCard>
            {!props.isMergedWithPreviousMessage &&
              <div>
                <MessageAuthor name={props.userFirstName}/>

                <MessageTime
                  href={props.pathToMessage}
                  time={props.time}/>
              </div>}

            <MessageGutter>
              <MessageTime
                href={props.pathToMessage}
                time={props.time}/>
            </MessageGutter>

            <MessageContent text={props.text}/>
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
    openUserDetails
  }),
  withProps(transsoc({
    userAvatar: getUserAvatar,
    userFirstName: getUserFirstName,
    userFullNameOrEmail: getUserFullNameOrEmail,
    pathToMessage: getMessagePath,
    time: getMessageTime
  }))
)(Message);
