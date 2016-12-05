import {
  INIT_SECTIONS,
  SET_SECTIONS,
  SET_STANDARDS,
  INIT_TYPES,
  SET_TYPES,
  SET_FILTERED_STANDARDS,
  INIT_STANDARDS,
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

export function setFilteredStandards(standardsFiltered) {
  return {
    payload: { standardsFiltered },
    type: SET_FILTERED_STANDARDS,
  };
}
