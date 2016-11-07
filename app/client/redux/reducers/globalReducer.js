import { equals } from '/imports/api/helpers';

import {
  SET_FILTER,
  SET_SEARCH_TEXT,
  ADD_COLLAPSED,
  REMOVE_COLLAPSED
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
      return { ...state, collapsed: [...new Set(state.collapsed.concat(action.payload))] };
    case REMOVE_COLLAPSED:
      const idx = state.collapsed.findIndex(equals(action.payload));
      const collapsed = idx === -1
        ? state.collapsed
        : state.collapsed.slice(0, idx, idx + 1, state.collapsed.length);
      return { ...state, collapsed };
    default:
      return state;
  }
}
