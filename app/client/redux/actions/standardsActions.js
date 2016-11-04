import {
  INIT_SECTIONS,
  SET_SECTIONS,
  SET_STANDARDS,
  SET_TYPES,
  SET_STANDARD,
  SET_STANDARD_ID,
  SET_IS_CARD_READY,
  TOGGLE_SECTION_COLLAPSED,
  SET_FILTERED_STANDARDS,
  SET_FILTERED_SECTIONS
} from './types';

export function initSections(payload) {
  return {
    payload,
    type: INIT_SECTIONS
  }
}

export function setSections(payload) {
  return {
    payload,
    type: SET_SECTIONS
  }
}

export function toggleSectionCollapsed(index, shouldCloseOthers = true) {
  return {
    payload: {
      index,
      shouldCloseOthers
    },
    type: TOGGLE_SECTION_COLLAPSED,
    meta: {
      throttle: 400
    }
  }
}

export function setStandards(payload) {
  return {
    payload,
    type: SET_STANDARDS
  }
}

export function setTypes(payload) {
  return {
    payload,
    type: SET_TYPES
  }
}

export function setStandard(payload) {
  return {
    payload,
    type: SET_STANDARD
  }
}

export function setStandardId(payload) {
  return {
    payload,
    type: SET_STANDARD_ID
  }
}

export function setIsCardReady(payload) {
  return {
    payload,
    type: SET_IS_CARD_READY
  }
}

export function setFilteredStandards(payload) {
  return {
    payload,
    type: SET_FILTERED_STANDARDS
  }
}

export function setFilteredSections(payload) {
  return {
    payload,
    type: SET_FILTERED_SECTIONS
  }
}
