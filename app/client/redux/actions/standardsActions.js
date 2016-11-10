import {
  INIT_SECTIONS,
  SET_SECTIONS,
  SET_STANDARDS,
  INIT_TYPES,
  SET_TYPES,
  SET_STANDARD,
  SET_IS_CARD_READY,
  SET_FILTERED_STANDARDS,
  SET_FILTERED_SECTIONS,
  SET_FILTERED_TYPES,
  INIT_STANDARDS,
  SET_ALL_SECTIONS,
  SET_ALL_TYPES,
  SET_IS_FULL_SCREEN_MODE,
} from './types';

export function initSections(payload) {
  return {
    payload,
    type: INIT_SECTIONS,
  };
}

export function setSections(payload) {
  return {
    payload,
    type: SET_SECTIONS,
  };
}

export function setAllSections(payload) {
  return {
    payload,
    type: SET_ALL_SECTIONS,
  };
}

export function initStandards(payload) {
  return {
    payload,
    type: INIT_STANDARDS,
  };
}

export function setStandards(payload) {
  return {
    payload,
    type: SET_STANDARDS,
  };
}

export function initTypes(payload) {
  return {
    payload,
    type: INIT_TYPES,
  };
}

export function setTypes(payload) {
  return {
    payload,
    type: SET_TYPES,
  };
}

export function setAllTypes(payload) {
  return {
    payload,
    type: SET_ALL_TYPES,
  };
}

export function setStandard(payload) {
  return {
    payload,
    type: SET_STANDARD,
  };
}

export function setIsCardReady(payload) {
  return {
    payload,
    type: SET_IS_CARD_READY,
  };
}

export function setFilteredStandards(payload) {
  return {
    payload,
    type: SET_FILTERED_STANDARDS,
  };
}

export function setFilteredSections(payload) {
  return {
    payload,
    type: SET_FILTERED_SECTIONS,
  };
}

export function setFilteredTypes(payload) {
  return {
    payload,
    type: SET_FILTERED_TYPES,
  };
}

export function setIsFullScreenMode(payload) {
  return {
    payload,
    type: SET_IS_FULL_SCREEN_MODE,
  };
}
