import React from 'react';
import { compose, lifecycle, withProps, withHandlers } from 'recompose';
import invoke from 'lodash.invoke';

import { transsoc } from '/imports/api/helpers';
import Message from '../Message';

import {
  isAuthor,
  getMessagePath,
  getUserAvatar,
  getUserFirstName,
  getUserFullNameOrEmail,
  getMessageTime,
  getMessageContents,
  getPathToMessageToCopy,
  getClassName
} from './helpers';

import {
  openUserDetails,
  select,
  deselect,
  remove
} from './handlers';

export default compose(
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return this.props._id === nextProps.at                                       ||
             (this.props.at === this.props._id && !nextProps.at)                   ||
             (this.props.at === this.props._id && nextProps.at !== this.props._id) ||
             !this.props.isMergedWithPreviousMessage && nextProps.isMergedWithPreviousMessage;
    },
    componentDidMount() {
      if (this.props.isSelected) {
        invoke(this.props, 'scrollToSelectedMessage', this);
      }
    }
  }),
  withHandlers({
    onMessageAvatarClick: openUserDetails,
    onMessageContentsClick: deselect,
    onMessageTimeClick: select,
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
