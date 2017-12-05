/* eslint-disable react/prop-types */
import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import Loadable from 'react-loadable';

import { getMentionData, getMentionDataWithUsers } from '/imports/share/mentions';
import { getFormattedDate } from '/imports/share/helpers';
import { TruncatedStringLengths } from '/imports/api/constants';
import FileProvider from '../../../containers/providers/FileProvider';
import { openUserDetails } from './handlers';

// Helpers

const renderMentions = (text, defaultRenderer) => {
  const data = getMentionDataWithUsers(getMentionData(text));
  const content = data.map(({
    firstName, email, user, mentionString,
  }, i) => (user ? (
    <a key={email} onClick={openUserDetails({ user })}>{firstName}</a>
  ) : defaultRenderer(mentionString, i, text)));

  return content;
};

const LoadableAutolinker = Loadable({
  loader: () => import('../../../components/ReactAutolinker'),
  loading: () => <div>Loading...</div>,
  render({ default: Component }, { text }) {
    const options = { mention: 'twitter', truncate: TruncatedStringLengths.c40 };

    return <Component {...{ text, options }} />;
  },
});

const renderText = ({ text }) =>
  renderMentions(text, (str, i) => <LoadableAutolinker key={i} text={str} />);

// Prop creators

export const getMessagePath = (props) => {
  const currentRouteName = FlowRouter.getRouteName();
  const { params } = FlowRouter.current();
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
  const { params } = FlowRouter.current();
  const queryParams = { at: props._id };

  return FlowRouter.path(currentRouteName, params, queryParams);
};

export const getPathToMessageToCopy = (props) => {
  const path = getPathToMessage(props);
  const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;

  return `${url}${path}`;
};

export const getClassName = (props) => {
  const first = props.isMergedWithPreviousMessage ? '' : 'first';
  const selected = props.isSelected ? 'selected' : '';

  return `${first} ${selected}`;
};
