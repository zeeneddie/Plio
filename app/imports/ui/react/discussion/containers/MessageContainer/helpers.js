/* eslint-disable react/prop-types */
import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import { getFormattedDate } from '/imports/share/helpers';
import { invokeC } from '/imports/api/helpers';
import { TruncatedStringLengths } from '/imports/api/constants';
import FileProvider from '../../../containers/providers/FileProvider';
import { openUserDetails } from './handlers';
import ReactAutolinker from '../../../components/ReactAutolinker';
import { MENTION_EMAIL_REGEX } from '../../../components/Mention/constants';

// Helpers

export const invokeUser = path => obj => invokeC(path, obj.user);

const renderMentions = (text, defaultRenderer) => {
  const splitted = text.split(MENTION_EMAIL_REGEX);
  const content = splitted.filter(Boolean).map((str, i) => {
    if (MENTION_EMAIL_REGEX.test(str)) {
      const mentionExecRegexSource = MENTION_EMAIL_REGEX.source
        .substring(1, MENTION_EMAIL_REGEX.source.length - 1)
        .split(' ')
        .map(r => `(${r})`)
        .join(' ');
      const mentionExecRegex = new RegExp(mentionExecRegexSource, 'gi');
      const match = mentionExecRegex.exec(str);
      const firstName = match[1];
      const email = match[2].substring(1, match[2].length - 1);
      const user = Meteor.users.findOne({ 'emails.address': email });
      const onClick = openUserDetails({ user });

      return <a {...{ onClick }} key={email}>{firstName}</a>;
    }

    return defaultRenderer(str, i, text);
  });

  return content;
};

const renderText = ({ text }) => {
  const options = { mention: 'twitter', truncate: TruncatedStringLengths.c40 };

  return renderMentions(text, (str, i) => <ReactAutolinker key={i} text={str} {...{ options }} />);
};

// Prop creators

export const getMessagePath = (props) => {
  const currentRouteName = FlowRouter.getRouteName();
  const params = FlowRouter.current().params;
  const queryParams = { at: props._id };

  return FlowRouter.path(currentRouteName, params, queryParams);
};

export const getUserAvatar = invokeUser('avatar');

export const getUserFullNameOrEmail = invokeUser('fullNameOrEmail');

export const getUserFirstName = invokeUser('firstName');

export const getMessageTime = props => getFormattedDate(props.createdAt, 'h:mm A');

export const getMessageContents = ({ text = '', type, fileId }) => {
  switch (type) {
    case 'text':
      return renderText({ text });
    case 'file':
      return fileId && <FileProvider {...{ fileId }} />;
    default:
      return text;
  }
};

export const getPathToMessage = (props) => {
  const currentRouteName = FlowRouter.getRouteName();
  const params = FlowRouter.current().params;
  const queryParams = { at: props._id };

  return FlowRouter.path(currentRouteName, params, queryParams);
};

export const getPathToMessageToCopy = (props) => {
  const path = getPathToMessage(props);
  const url = `${location.protocol}//${location.hostname}:${location.port}`;

  return `${url}${path}`;
};

export const getClassName = (props) => {
  const first = props.isMergedWithPreviousMessage ? '' : 'first';
  const selected = props.isSelected ? 'selected' : '';

  return `${first} ${selected}`;
};
