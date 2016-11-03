import {
  SET_FILTER,
  SET_SEARCH_TEXT
} from './types';

export function setFilter(payload) {
  return {
    payload,
    type: SET_FILTER
  }
}

export function setSearchText(payload) {
  return {
    payload,
    type: SET_SEARCH_TEXT
  }
}
