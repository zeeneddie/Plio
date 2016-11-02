import {
  SET_SECTIONS,
  SET_STANDARDS,
  SET_TYPES,
  SET_STANDARD,
  SET_STANDARD_ID,
  SET_IS_CARD_READY,
  TOGGLE_SECTION_COLLAPSED,
  CLOSE_COLLAPSIBLES
} from './types';

export function setSections(payload) {
  return {
    payload,
    type: SET_SECTIONS
  }
}

export function toggleSectionCollapsed(index, shouldCloseOthers = false) {
  return {
    payload: {
      index,
      shouldCloseOthers
    },
    type: TOGGLE_SECTION_COLLAPSED
  }
}

export function closeCollapsibles(payload) {
  return {
    payload,
    type: CLOSE_COLLAPSIBLES
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
