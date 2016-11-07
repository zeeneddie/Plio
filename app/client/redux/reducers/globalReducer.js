import { equals } from '/imports/api/helpers';
import { addCollapsed, removeCollapsed } from '../lib/globalHelpers';

import {
  SET_FILTER,
  SET_SEARCH_TEXT,
  ADD_COLLAPSED,
  REMOVE_COLLAPSED,
  TOGGLE_COLLAPSED
} from '../actions/types';

const initialState = {
  filter: 1,
  searchText: '',
  collapsed: []
};

export default function(state=initialState, action) {
  switch(action.type) {
    case SET_FILTER:
      return { ...state, filter: action.payload };
    case SET_SEARCH_TEXT:
      return { ...state, searchText: action.payload };
    case ADD_COLLAPSED:
      return { ...state, collapsed: addCollapsed(state.collapsed, action.payload) };
    case REMOVE_COLLAPSED:
      return { ...state, collapsed: removeCollapsed(state.collapsed, action.payload) };
    default:
      return state;
  }
}
