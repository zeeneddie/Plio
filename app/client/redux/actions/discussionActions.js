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
