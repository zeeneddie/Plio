import {
  SET_IS_HELP_CARD_READY,
  SET_HELP_SECTIONS_DATA,
  SET_HELP_DOCS_DATA,
  SET_FILTERED_HELP_DOCS,
  SET_HELP_CARD_FULL_SCREEN,
} from '../actions/types';

const initialState = {
  isHelpCardReady: false,
  helpSectionsData: [],
  helpDocsData: [],
  helpDocsFiltered: [],
  helpCardFullScreen: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_IS_HELP_CARD_READY:
    case SET_HELP_SECTIONS_DATA:
    case SET_HELP_DOCS_DATA:
    case SET_FILTERED_HELP_DOCS:
    case SET_HELP_CARD_FULL_SCREEN:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
