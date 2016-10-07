import { FlowRouter } from 'meteor/kadira:flow-router';
import { Autolinker } from 'meteor/konecty:autolinker';
import React from 'react';

import modal from '/imports/startup/client/mixins/modal';
import { invokeC, getFormattedDate, handleMethodResult } from '/imports/api/helpers';
import { TruncatedStringLengths } from '/imports/api/constants';
import { remove as removeMessage } from '/imports/api/messages/methods';
import { setAt } from '/client/redux/actions/discussionActions';

import FileItemRead from '../FileItemRead';

// Helpers

export const invokeUser = path => obj => invokeC(path, obj.user);

export const isAuthor = props => Object.is(Meteor.userId(), props.createdBy);

export const setAtWithRouter = (val, props) => {
  FlowRouter.setQueryParams({ at: val });
  props.dispatch(setAt(val));
}

export const clearAtWithRouter = (props) => {
  if (props.isSelected) {
    setAtWithRouter(null, props);
  }
}

// Prop creators

export const getMessagePath = (props) => {
  const currentRouteName = FlowRouter.getRouteName();
  const params = FlowRouter.current().params;
  const queryParams = { at: props._id };

  return FlowRouter.path(currentRouteName, params, queryParams);
}

export const getUserAvatar = invokeUser('avatar');

export const getUserFullNameOrEmail = invokeUser('fullNameOrEmail');

export const getUserFirstName = invokeUser('firstName');

export const getMessageTime = props => getFormattedDate(props.createdAt, 'h:mm A');

export const getMessageContents = (props) => {
  switch(props.type) {
    case 'text':
      const createMarkup = () => ({
        __html: Autolinker.link(props.text || '', {
          truncate: TruncatedStringLengths.c40
        })
      });
      return <span dangerouslySetInnerHTML={createMarkup()}></span>;
      break;
    case 'file':
      return <FileItemRead {...props} />;
      break;
    default:
      return props.text;
      break;
  }
}

export const getPathToMessage = (props) => {
  const currentRouteName = FlowRouter.getRouteName();
  const params = FlowRouter.current().params;
  const queryParams = { at: props._id };

  return FlowRouter.path(currentRouteName, params, queryParams);
}

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


// Handlers

export const openUserDetails = (props) => {
  return (e) => {
    e.preventDefault();

    modal.modal.open({
      template: 'UserDirectory_Card_Read_Inner',
      _title: 'User details',
      user: props.user
    });
  };
}

export const select = props => e => props.dispatch(setAt(props._id));

export const deselect = props => e => clearAtWithRouter(props);

export const remove = (props) => {
  return (e) => {
    if (!isAuthor(props)) return;

    swal({
      title: 'Are you sure you want to delete this message?',
      text: 'This cannot be undone.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      closeOnConfirm: true
    },
    () => {
      const cb = (err, res) => !err && clearAtWithRouter(props);

      return removeMessage.call({ _id: props._id }, handleMethodResult(cb));
    });
  };
};
