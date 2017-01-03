import React, { PropTypes } from 'react';

import MessageDate from '../MessageDate';
import MessageBox from '../MessageBox';
import MessageAvatar from '../MessageAvatar';
import MessageCard from '../MessageCard';
import MessageAuthor from '../MessageAuthor';
import MessageTime from '../MessageTime';
import MessageGutter from '../MessageGutter';
import MessageContent from '../MessageContent';
import MessageMenu from '../MessageMenu';

const Message = ({
  date,
  dateToShow,
  className,
  isMergedWithPreviousMessage,
  userAvatar,
  userFullNameOrEmail,
  onMessageAvatarClick,
  userFirstName,
  onMessageTimeClick,
  pathToMessage,
  time,
  isAuthor,
  pathToMessageToCopy,
  onMessageDelete,
  contents,
  onMessageContentsClick,
}) => (
  <div className="chat-message-container">
    {dateToShow && <MessageDate {...{ date }} />}

    <MessageBox className={className}>
      {!isMergedWithPreviousMessage &&
        <MessageAvatar
          avatar={userAvatar}
          alt={userFullNameOrEmail}
          onClick={onMessageAvatarClick}
        />}

      <MessageCard>
        {!isMergedWithPreviousMessage &&
          (<div>
            <MessageAuthor name={userFirstName} />

            <MessageTime
              {...{ time }}
              onClick={onMessageTimeClick}
              href={pathToMessage}
            />
          </div>)}

        <MessageMenu
          {...{ isAuthor }}
          pathToMessageToCopy={pathToMessageToCopy}
          delete={onMessageDelete}
        />

        <MessageGutter>
          <MessageTime
            onClick={onMessageTimeClick}
            href={pathToMessage}
            time={time.split(' ')[0]}
          />
        </MessageGutter>

        <MessageContent {...{ contents }} onClick={onMessageContentsClick} />
      </MessageCard>
    </MessageBox>
  </div>
);

Message.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  dateToShow: PropTypes.bool,
  className: PropTypes.string,
  isMergedWithPreviousMessage: PropTypes.bool,
  userAvatar: PropTypes.string,
  userFullNameOrEmail: PropTypes.string,
  onMessageAvatarClick: PropTypes.func,
  userFirstName: PropTypes.string,
  onMessageTimeClick: PropTypes.func,
  pathToMessage: PropTypes.string,
  time: PropTypes.string,
  isAuthor: PropTypes.bool,
  pathToMessageToCopy: PropTypes.string,
  onMessageDelete: PropTypes.func,
  contents: PropTypes.any,
  onMessageContentsClick: PropTypes.func,
};

export default Message;
