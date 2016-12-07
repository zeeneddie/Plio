import { addCollapsed, removeCollapsed } from '../lib/globalHelpers';

import {
  SET_FILTER,
  SET_SEARCH_TEXT,
  ADD_COLLAPSED,
  REMOVE_COLLAPSED,
  SET_USER_ID,
  SET_ANIMATING,
  SET_URL_ITEM_ID,
  SET_DATA_LOADING,
  SET_IS_CARD_READY,
  SET_IS_LAYOUT_READY,
  SET_IS_FULL_SCREEN_MODE,
  SET_INITIALIZING,
} from '../actions/types';

const initialState = {
  userId: null,
  filter: 1,
  searchText: '',
  collapsed: [],
  animating: false,
  urlItemId: null,
  dataLoading: false,
  isLayoutReady: false,
  isCardReady: false,
  isFullScreenMode: false,
  initializing: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_ID:
    case SET_FILTER:
    case SET_SEARCH_TEXT:
    case SET_ANIMATING:
    case SET_URL_ITEM_ID:
    case SET_DATA_LOADING:
    case SET_IS_CARD_READY:
    case SET_IS_LAYOUT_READY:
    case SET_IS_FULL_SCREEN_MODE:
    case SET_INITIALIZING:
      return { ...state, ...action.payload };
    case ADD_COLLAPSED:
      return { ...state, collapsed: addCollapsed(state.collapsed, action.payload) };
    case REMOVE_COLLAPSED:
      return { ...state, collapsed: removeCollapsed(state.collapsed, action.payload) };
    default:
      return state;
  }
}
