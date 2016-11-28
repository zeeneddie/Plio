import {
  INIT_SECTIONS,
  SET_SECTIONS,
  SET_STANDARDS,
  INIT_TYPES,
  SET_TYPES,
  SET_IS_CARD_READY,
  SET_FILTERED_STANDARDS,
  SET_FILTERED_SECTIONS,
  SET_FILTERED_TYPES,
  INIT_STANDARDS,
  SET_IS_FULL_SCREEN_MODE,
} from './types';

export function initSections({ sections, types, standards }) {
  return {
    payload: { sections, types, standards },
    type: INIT_SECTIONS,
  };
}

export function setSections(sections) {
  return {
    payload: { sections },
    type: SET_SECTIONS,
  };
}

export function initStandards({ types, sections, standards, unreadMessagesCountMap }) {
  return {
    payload: { types, sections, standards, unreadMessagesCountMap },
    type: INIT_STANDARDS,
  };
}

export function setStandards(standards) {
  return {
    payload: { standards },
    type: SET_STANDARDS,
  };
}

export function initTypes({ sections, types }) {
  return {
    payload: { sections, types },
    type: INIT_TYPES,
  };
}

export function setTypes(types) {
  return {
    payload: { types },
    type: SET_TYPES,
  };
}

export function setIsCardReady(isCardReady) {
  return {
    payload: { isCardReady },
    type: SET_IS_CARD_READY,
  };
}

export function setFilteredStandards(standardsFiltered) {
  return {
    payload: { standardsFiltered },
    type: SET_FILTERED_STANDARDS,
  };
}

export function setFilteredSections(sectionsFiltered) {
  return {
    payload: { sectionsFiltered },
    type: SET_FILTERED_SECTIONS,
  };
}

export function setFilteredTypes(typesFiltered) {
  return {
    payload: { typesFiltered },
    type: SET_FILTERED_TYPES,
  };
}

export function setIsFullScreenMode(isFullScreenMode) {
  return {
    payload: { isFullScreenMode },
    type: SET_IS_FULL_SCREEN_MODE,
  };
}
