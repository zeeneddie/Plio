import {
  SET_FILTER,
  SET_SEARCH_TEXT
} from '../actions/types';

const initialState = {
  filter: 1,
  searchText: '',
};

export default function(state=initialState, action) {
  switch(action.type) {
    case SET_FILTER:
      return { ...state, filter: action.payload };
    case SET_SEARCH_TEXT:
      return { ...state, searchText: action.payload };
    default:
      return state;
  }
}
