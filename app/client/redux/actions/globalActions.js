import { equals } from '/imports/api/helpers';

import {
  SET_FILTER,
  SET_SEARCH_TEXT,
  ADD_COLLAPSED,
  REMOVE_COLLAPSED
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

export function addCollapsed(payload, close) {
  return {
    payload: {
      ...payload,
      close
    },
    type: ADD_COLLAPSED,
    meta: {
      throttle: 400
    }
  }
}

export function removeCollapsed(payload) {
  return {
    payload,
    type: REMOVE_COLLAPSED
  }
}

export function toggleCollapsed(payload, close) {
  return (dispatch, getState) => {
    const collapsed = getState().global.collapsed.find(equals(payload));

    return collapsed
      ? dispatch(removeCollapsed(payload))
      : dispatch(addCollapsed(payload, close));
  }
}

export function collapseMulti(actions, wait = 400) {
  return (dispatch) => {
    const start = (i) => {
      if (i === actions.length) return;

      dispatch(actions[i]);

      Meteor.setTimeout(() => start(i + 1), wait);
    };

    start(0);
  }
}
