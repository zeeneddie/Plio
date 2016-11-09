import { assoc } from '/imports/api/helpers';

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
  SET_STANDARD_ID,
  SET_IS_CARD_READY,
  SET_FILTERED_STANDARDS,
  SET_FILTERED_SECTIONS,
  SET_FILTERED_TYPES,
  SET_ALL_SECTIONS,
  SET_ALL_TYPES,
} from '../actions/types';

const initialState = {
  sections: [],
  sectionsFiltered: [],
  allSections: [],
  types: [],
  typesFiltered: [],
  allTypes: [],
  standards: [],
  standardsFiltered: [],
  standard: null,
  standardId: null,
  isCardReady: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INIT_SECTIONS:
      return {
        ...state,
        sections: initSections(assoc('types', state.allTypes, state), action.payload) };
    case SET_SECTIONS:
      return { ...state, sections: action.payload };
    case SET_ALL_SECTIONS:
      return { ...state, allSections: action.payload };
    case SET_STANDARDS:
      return { ...state, standards: action.payload };
    case INIT_TYPES:
      return { ...state, types: initTypes(state, action.payload) };
    case SET_TYPES:
      return { ...state, types: action.payload };
    case SET_ALL_TYPES:
      return { ...state, allTypes: action.payload };
    case INIT_STANDARDS:
      return { ...state, standards: initStandards(state, action.payload) };
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
