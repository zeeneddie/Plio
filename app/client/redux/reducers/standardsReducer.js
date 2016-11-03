import { toggleSection, mapSections } from '../lib/helpers';
import { UncategorizedTypeSection } from '/imports/api/constants';

import {
  INIT_SECTIONS,
  SET_STANDARDS,
  SET_TYPES,
  SET_STANDARD,
  SET_STANDARD_ID,
  SET_IS_CARD_READY,
  TOGGLE_SECTION_COLLAPSED,
  SET_FILTERED_STANDARDS,
  SET_FILTERED_SECTIONS,
} from '../actions/types';

const initialState = {
  sections: [],
  sectionsFiltered: [],
  types: [],
  standards: [],
  standardsFiltered: [],
  standard: null,
  standardId: null,
  isCardReady: false
};

export default function reducer(state=initialState, action) {
  switch(action.type) {
    case INIT_SECTIONS:
      return mapSections(state, action.payload);
    case TOGGLE_SECTION_COLLAPSED:
      return toggleSection(state, action);
    case SET_STANDARDS:
      return { ...state, standards: action.payload };
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
    default:
      return state;
  }
}
