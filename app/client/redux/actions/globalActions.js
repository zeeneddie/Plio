import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { equals } from '/imports/api/helpers';
import {
  SET_USER_ID,
  SET_FILTER,
  SET_SEARCH_TEXT,
  ADD_COLLAPSED,
  REMOVE_COLLAPSED,
} from './types';

export function setUserId(payload) {
  return {
    payload,
    type: SET_USER_ID,
  };
}

export function setFilter(payload) {
  return {
    payload,
    type: SET_FILTER,
  };
}

export function setSearchText(payload) {
  return {
    payload,
    type: SET_SEARCH_TEXT,
  };
}

export function addCollapsed(payload) {
  return {
    payload,
    type: ADD_COLLAPSED,
    meta: {
      throttle: 400,
    },
  };
}

export function removeCollapsed(payload) {
  return {
    payload,
    type: REMOVE_COLLAPSED,
  };
}

export function toggleCollapsed(payload) {
  return (dispatch, getState) => {
    const withoutClose = _.omit(payload, 'close');
    const collapsed = getState().global.collapsed.find(equals(withoutClose));

    return collapsed
      ? dispatch(removeCollapsed(withoutClose))
      : dispatch(addCollapsed(payload));
  };
}

export function collapseMulti(actions, wait = 400) {
  return (dispatch) => {
    const start = (i) => {
      if (i === actions.length) return;

      dispatch(actions[i]);

      Meteor.setTimeout(() => start(i + 1), wait);
    };

    start(0);
  };
}
