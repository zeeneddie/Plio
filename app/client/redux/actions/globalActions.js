import {
  SET_FILTER
} from './types';

export function setFilter(payload) {
  return {
    payload,
    type: SET_FILTER
  }
}
