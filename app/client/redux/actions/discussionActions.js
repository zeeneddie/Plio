import { sanitizeHtml } from 'meteor/djedi:sanitize-html-client';
import { FlowRouter } from 'meteor/kadira:flow-router';

import {
  SET_MESSAGES,
  SET_LOADING,
  SET_SORT,
  SET_AT,
  RESET,
  SET_LAST_MESSAGE_ID,
  SET_PRIOR_LIMIT,
  SET_FOLLOWING_LIMIT,
  SET_INITIAL_DATA_LOADED,
  SET_RESET_COMPLETED,
  SET_DISCUSSION
} from './types';
import { initialState } from '../reducers/discussionReducer';
import { handleMethodResult } from '/imports/api/helpers';
import { insert, remove } from '/imports/api/messages/methods';
import { updateViewedByDiscussion } from '/imports/api/discussions/methods';
import { isAuthor } from '/imports/api/messages/helpers';

export function setDiscussion(discussion) {
  return {
    type: SET_DISCUSSION,
    payload: discussion
  }
}

export function setMessages(messages) {
  return {
    type: SET_MESSAGES,
    payload: messages
  }
}

export function setLoading(bool) {
  return {
    type: SET_LOADING,
    payload: bool
  }
}

export function setSort(sort) {
  return {
    type: SET_SORT,
    payload: sort
  }
}

export function setAt(at) {
  return {
    type: SET_AT,
    payload: at
  }
}

export function reset() {
  return {
    type: RESET,
    payload: { ...initialState, resetCompleted: true }
  }
}

export function setLastMessageId(id) {
  return {
    type: SET_LAST_MESSAGE_ID,
    payload: id
  }
}

export function setPriorLimit(limit) {
  return {
    type: SET_PRIOR_LIMIT,
    payload: limit
  }
}

export function setFollowingLimit(limit) {
  return {
    type: SET_FOLLOWING_LIMIT,
    payload: limit
  }
}

export function setResetCompleted(bool) {
  return {
    type: SET_RESET_COMPLETED,
    payload: bool
  }
}

export const submit = ({
  organizationId,
  discussionId,
  text,
  fileId,
  type
}, callback = () => {}) => {
  return (dispatch, getState) => {
    return insert.call({
      organizationId,
      discussionId,
      type,
      fileId,
      text: sanitizeHtml(text),
    }, handleMethodResult(callback(dispatch, getState)));
  }
}

export const markMessagesAsRead = (discussion, message) => {
  return (dispatch) => {
    const { _id:discussionId, viewedBy = [] } = discussion;
    const { _id:messageId, createdAt = null } = message;
    const { viewedUpTo = null } = Object.assign({}, viewedBy.find(fields =>
        Object.is(fields.userId, Meteor.userId())));

    // mark messages as read if the last message is actually a new one
    if (viewedUpTo < message.createdAt) {
      return updateViewedByDiscussion.call({
        messageId,
        _id: discussionId
      });
    }
  }
}

export const removeMessage = (message, cb = () => {}) => (dispatch, getState) => {
  if (!isAuthor(message)) return;

  swal({
    title: 'Are you sure you want to delete this message?',
    text: 'This cannot be undone.',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Remove',
    closeOnConfirm: true
  },
  () => remove.call({ _id: message._id }, handleMethodResult(cb(dispatch, getState))));
};
