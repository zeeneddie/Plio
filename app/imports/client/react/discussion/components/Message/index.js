import PropTypes from 'prop-types';
import React from 'react';
import { compose, withState, withHandlers } from 'recompose';

import { not } from '/imports/api/helpers';

import Author from './Author';
import Avatar from './Avatar';
import Box from './Box';
import Card from './Card';
import Container from './Container';
import Content from './Content';
import Date from './Date';
import Gutter from './Gutter';
import Menu from './Menu';
import Time from './Time';

const MenuEnhanced = compose(
  withState('isOpen', 'setOpen', false),
  withHandlers({
    toggle: ({ setOpen }) => () => setOpen(not),
  }),
)(Menu);

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
  <Container>
    {dateToShow && <Date>{date}</Date>}

    <Box className={className}>
      {!isMergedWithPreviousMessage && (
        <Avatar onClick={onMessageAvatarClick}>
          <img src={userAvatar} alt={userFullNameOrEmail} tabIndex="0" />
        </Avatar>
      )}

      <Card>
        {!isMergedWithPreviousMessage &&
          (<div>
            <Author>{userFirstName}</Author>

            <Time onClick={onMessageTimeClick} href={pathToMessage}>
              {time}
            </Time>
          </div>)}

        <MenuEnhanced
          {...{ isAuthor }}
          pathToMessage={pathToMessageToCopy}
          onDelete={onMessageDelete}
        />

        <Gutter>
          <Time onClick={onMessageTimeClick} href={pathToMessage}>
            {`${time}`.split(' ')[0]}
          </Time>
        </Gutter>

        <Content onClick={onMessageContentsClick}>{contents}</Content>
      </Card>
    </Box>
  </Container>
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

const components = {
  Author,
  Avatar,
  Box,
  Card,
  Container,
  Content,
  Date,
  Gutter,
  Menu,
};

Object.assign(Message, components);

export default Message;
