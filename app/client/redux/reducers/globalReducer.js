import { addCollapsed, removeCollapsed } from '../lib/globalHelpers';

import {
  SET_FILTER,
  SET_SEARCH_TEXT,
  ADD_COLLAPSED,
  REMOVE_COLLAPSED,
  SET_USER_ID,
  SET_ANIMATING,
} from '../actions/types';

const initialState = {
  userId: null,
  filter: 1,
  searchText: '',
  collapsed: [],
  animating: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_ID:
      return { ...state, userId: action.payload };
    case SET_FILTER:
      return { ...state, filter: action.payload };
    case SET_SEARCH_TEXT:
      return { ...state, searchText: action.payload };
    case ADD_COLLAPSED:
      return { ...state, collapsed: addCollapsed(state.collapsed, action.payload) };
    case REMOVE_COLLAPSED:
      return { ...state, collapsed: removeCollapsed(state.collapsed, action.payload) };
    case SET_ANIMATING:
      return { ...state, animating: action.payload };
    default:
      return state;
  }
}
