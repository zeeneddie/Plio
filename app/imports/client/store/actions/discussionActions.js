import { Meteor } from 'meteor/meteor';
import { initialState } from '../reducers/discussionReducer';
import { handleMethodResult } from '/imports/api/helpers';
import { insert, remove } from '/imports/api/messages/methods';
import { updateViewedByDiscussion } from '/imports/api/discussions/methods';
import { isAuthor } from '/imports/client/react/discussion/helpers';
import {
  SET_MESSAGES,
  SET_DISCUSSION_LOADING,
  SET_SORT,
  SET_AT,
  RESET,
  SET_LAST_MESSAGE_ID,
  SET_PRIOR_LIMIT,
  SET_FOLLOWING_LIMIT,
  SET_RESET_COMPLETED,
  SET_DISCUSSION,
  SET_IS_DISCUSSION_OPENED,
} from './types';

export function setDiscussion(discussion) {
  return {
    type: SET_DISCUSSION,
    payload: { discussion },
  };
}

export function setMessages(messages) {
  return {
    type: SET_MESSAGES,
    payload: { messages },
  };
}

export function setLoading(loading) {
  return {
    type: SET_DISCUSSION_LOADING,
    payload: { loading },
  };
}

export function setSort(sort) {
  return {
    type: SET_SORT,
    payload: { sort },
  };
}

export function setAt(at) {
  return {
    type: SET_AT,
    payload: { at },
  };
}

export function reset({ isDiscussionOpened = false, ...other } = {}) {
  return {
    type: RESET,
    payload: {
      ...initialState, isDiscussionOpened, resetCompleted: true, ...other,
    },
  };
}

export function setLastMessageId(lastMessageId) {
  return {
    type: SET_LAST_MESSAGE_ID,
    payload: { lastMessageId },
  };
}

export function setPriorLimit(priorLimit) {
  return {
    type: SET_PRIOR_LIMIT,
    payload: { priorLimit },
  };
}

export function setFollowingLimit(followingLimit) {
  return {
    type: SET_FOLLOWING_LIMIT,
    payload: { followingLimit },
  };
}

export function setResetCompleted(resetCompleted) {
  return {
    type: SET_RESET_COMPLETED,
    payload: { resetCompleted },
  };
}

export function setIsDiscussionOpened(isDiscussionOpened) {
  return {
    payload: { isDiscussionOpened },
    type: SET_IS_DISCUSSION_OPENED,
  };
}

export const submit = (
  {
    organizationId, discussionId, text: inputText, fileId, type,
  },
  callback = () => {},
) => async (dispatch, getState) => {
  const { default: sanitizeHtml } = await import('sanitize-html');
  const text = sanitizeHtml(inputText);

  if (!text) return;

  insert.call(
    {
      organizationId,
      discussionId,
      type,
      fileId,
      text,
    },
    handleMethodResult(callback(dispatch, getState)),
  );
};

export const markMessagesAsRead = (discussion, message) =>
  () => {
    const { _id: discussionId, viewedBy = [] } = discussion;
    const { _id: messageId } = message;
    const { viewedUpTo = null } = Object.assign({}, viewedBy.find(fields =>
      Object.is(fields.userId, Meteor.userId())));

    // mark messages as read if the last message is actually a new one
    if (viewedUpTo < message.createdAt) {
      return updateViewedByDiscussion.call({
        messageId,
        _id: discussionId,
      });
    }

    return undefined;
  };

export const removeMessage = (message, cb = () => {}) =>
  (dispatch, getState) => {
    if (!isAuthor(message)) return;

    window.swal(
      {
        title: 'Are you sure you want to delete this message?',
        text: 'This cannot be undone.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: true,
      },
      () => remove.call({ _id: message._id }, handleMethodResult(cb(dispatch, getState))),
    );
  };
