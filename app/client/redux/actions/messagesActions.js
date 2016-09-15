import { SET_MESSAGES, SET_LIMIT } from './types';

export function setMessages(messages) {
  return {
    type: SET_MESSAGES,
    payload: messages
  };
}

export function setLimit(limit) {
  return {
    type: SET_LIMIT,
    payload: limit
  }
}
