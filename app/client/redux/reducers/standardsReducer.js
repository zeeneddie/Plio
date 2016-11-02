import { mapByIndex, assoc } from '/imports/api/helpers';

import {
  SET_SECTIONS,
  SET_STANDARDS,
  SET_TYPES,
  SET_STANDARD,
  SET_STANDARD_ID,
  SET_IS_CARD_READY,
  TOGGLE_SECTION_COLLAPSED
} from '../actions/types';

const initialState = {
  sections: [],
  types: [],
  standards: [],
  standard: null,
  standardId: null,
  isCardReady: false,
};

const toggleSection = (state, action) => {
  const { index, shouldCloseOthers } = action.payload;
  const section = state.sections[index];
  let sections;

  if (shouldCloseOthers) {
    sections = state.sections.map((section, i) => {
      return i === index
        ? { ...section, collapsed: !section.collapsed }
        : { ...section, collapsed: true };
    });
  } else {
    sections = mapByIndex(
      assoc('collapsed', !section.collapsed, section),
      index,
      state.sections
    );
  }

  return { ...state, sections };
};

export default function reducer(state=initialState, action) {
  switch(action.type) {
    case SET_SECTIONS:
      return { ...state, sections: action.payload };
      break;
    case TOGGLE_SECTION_COLLAPSED:
      return toggleSection(state, action);
      break;
    case SET_STANDARDS:
      return { ...state, standards: action.payload };
      break;
    case SET_TYPES:
      return { ...state, types: action.payload };
      break;
    case SET_STANDARD:
      return { ...state, standard: action.payload };
      break;
    case SET_STANDARD_ID:
      return { ...state, standardId: action.payload };
      break;
    case SET_IS_CARD_READY:
      return { ...state, isCardReady: action.payload };
      break;
    default:
      return state;
      break;
  }
}
