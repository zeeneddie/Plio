/* eslint-disable react/prop-types */
import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';

import { getFormattedDate } from '/imports/share/helpers';
import { TruncatedStringLengths } from '/imports/api/constants';
import FileProvider from '../../../containers/providers/FileProvider';
import { openUserDetails } from './handlers';
import ReactAutolinker from '../../../components/ReactAutolinker';
import { getMentionData, getMentionDataWithUsers } from '/imports/share/mentions';

// Helpers

const renderMentions = (text, defaultRenderer) => {
  const data = getMentionDataWithUsers(getMentionData(text));
  const content = data.map(({ firstName, email, user, mentionString }, i) => (user ? (
    <a key={email} onClick={openUserDetails({ user })}>{firstName}</a>
  ) : defaultRenderer(mentionString, i, text)));

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
