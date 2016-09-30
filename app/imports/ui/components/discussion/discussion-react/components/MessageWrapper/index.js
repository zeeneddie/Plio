import React from 'react';
import { compose, lifecycle, withProps, withHandlers } from 'recompose';

import { transsoc } from '/imports/api/helpers.js';
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
  getClassName,
  openUserDetails,
  select,
  deselect,
  remove
} from './constants.js';

export default compose(
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return this.props._id === nextProps.at                     ||
             (this.props.at === this.props._id && !nextProps.at) ||
             (this.props.at === this.props._id && nextProps.at !== this.props._id);
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
