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
} from '../actions/types';

const initialState = {
  userId: null,
  filter: 1,
  searchText: '',
  collapsed: [],
  animating: false,
  urlItemId: null,
  dataLoading: false,
  isCardReady: false,
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
      return { ...state, ...action.payload };
    case ADD_COLLAPSED:
      return { ...state, collapsed: addCollapsed(state.collapsed, action.payload) };
    case REMOVE_COLLAPSED:
      return { ...state, collapsed: removeCollapsed(state.collapsed, action.payload) };
    default:
      return state;
  }
}
