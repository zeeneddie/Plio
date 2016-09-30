import { batchActions } from 'redux-batched-actions';

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
  SET_RESET_COMPLETED
} from './types';
import { initialState } from '../reducers/discussionReducer';
import { Messages } from '/imports/api/messages/messages';
import { LastDiscussionMessage } from '/client/collections';

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

export function setInitialDataLoaded(bool) {
  return {
    type: SET_INITIAL_DATA_LOADED,
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

let handle;

export function subscribeToMessages(discussionId, subOptions = {}) {
  const query = { discussionId };
  const options = { sort: { createdAt: 1 } };
  return (dispatch) => {
    let handle = Meteor.subscribe('messages', discussionId, subOptions, {
      onReady() {
        const messages = Messages.find(query, options).fetch();

        dispatch(batchActions([
          setMessages(messages),
          setInitialDataLoaded(true),
          setLoading(false)
        ]));
      }
    });

    dispatch(setLoading(true));

    return handle;
  }
}

export function subscribeToLastMessage(discussionId) {
  return (dispatch) => {
    const handle = Meteor.subscribe('discussionMessagesLast', discussionId, {
      onReady() {
        const messageId = Object.assign({}, LastDiscussionMessage.findOne()).lastMessageId;
        dispatch(setLastMessageId(messageId));
      }
    });

    return handle;
  }
}

export function fetchMessages(discussionId) {
  return (dispatch, getState) => {
    const query = { discussionId };
    const options = { sort: { createdAt: 1 } };

    Tracker.autorun(() => {
      const { loading, isInitialDataLoaded, messages:storedMessages } = getState().discussion;
      const messages = Messages.find(query, options).fetch();

      if (!messages.length     ||
          loading              ||
          !isInitialDataLoaded ||
          messages.length === storedMessages.length) return;

      dispatch(setMessages(messages));
    });
  }
}


export function setResetCompleted(bool) {
  return {
    type: SET_RESET_COMPLETED,
    payload: bool
  }
}
