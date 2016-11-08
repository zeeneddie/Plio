import {
  mapSections,
  mapTypes,
} from '../lib/standardsHelpers';

import {
  INIT_SECTIONS,
  SET_SECTIONS,
  SET_STANDARDS,
  INIT_TYPES,
  SET_TYPES,
  SET_STANDARD,
  SET_STANDARD_ID,
  SET_IS_CARD_READY,
  SET_FILTERED_STANDARDS,
  SET_FILTERED_SECTIONS,
  SET_FILTERED_TYPES,
} from '../actions/types';

const initialState = {
  sections: [],
  sectionsFiltered: [],
  types: [],
  typesFiltered: [],
  standards: [],
  standardsFiltered: [],
  standard: null,
  standardId: null,
  isCardReady: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INIT_SECTIONS:
      return { ...state, sections: mapSections(state, action.payload) };
    case SET_SECTIONS:
      return { ...state, sections: action.payload };
    case SET_STANDARDS:
      return { ...state, standards: action.payload };
    case INIT_TYPES:
      return { ...state, types: mapTypes(state, action.payload) };
    case SET_TYPES:
      return { ...state, types: action.payload };
    case SET_STANDARD:
      return { ...state, standard: action.payload };
    case SET_STANDARD_ID:
      return { ...state, standardId: action.payload };
    case SET_IS_CARD_READY:
      return { ...state, isCardReady: action.payload };
    case SET_FILTERED_STANDARDS:
      return { ...state, standardsFiltered: action.payload };
    case SET_FILTERED_SECTIONS:
      return { ...state, sectionsFiltered: action.payload };
    case SET_FILTERED_TYPES:
      return { ...state, typesFiltered: action.payload };
    default:
      return state;
  }
}
