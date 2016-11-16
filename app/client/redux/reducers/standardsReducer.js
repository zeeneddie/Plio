import {
  initSections,
  initTypes,
  initStandards,
} from '../lib/standardsHelpers';

import {
  INIT_SECTIONS,
  SET_SECTIONS,
  SET_STANDARDS,
  INIT_TYPES,
  SET_TYPES,
  INIT_STANDARDS,
  SET_STANDARD,
  SET_IS_CARD_READY,
  SET_FILTERED_STANDARDS,
  SET_FILTERED_SECTIONS,
  SET_FILTERED_TYPES,
  SET_IS_FULL_SCREEN_MODE,
} from '../actions/types';

const initialState = {
  sections: [],
  sectionsFiltered: [],
  types: [],
  typesFiltered: [],
  standards: [],
  standardsFiltered: [],
  standard: null,
  isCardReady: false,
  isFullScreenMode: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SECTIONS:
    case SET_STANDARDS:
    case SET_TYPES:
    case SET_STANDARD:
    case SET_IS_CARD_READY:
    case SET_FILTERED_STANDARDS:
    case SET_FILTERED_SECTIONS:
    case SET_FILTERED_TYPES:
    case SET_IS_FULL_SCREEN_MODE:
      return { ...state, ...action.payload };
    case INIT_SECTIONS:
      return { ...state, sections: initSections(action.payload) };
    case INIT_TYPES:
      return { ...state, types: initTypes(action.payload) };
    case INIT_STANDARDS:
      return { ...state, standards: initStandards(action.payload) };
    default:
      return state;
  }
}
