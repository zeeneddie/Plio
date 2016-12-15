import {
  SET_HELP_SECTIONS_DATA,
  SET_FILTERED_HELP_DOCS,
} from '../actions/types';

const initialState = {
  helpSectionsData: [],
  helpDocsFiltered: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_HELP_SECTIONS_DATA:
    case SET_FILTERED_HELP_DOCS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
