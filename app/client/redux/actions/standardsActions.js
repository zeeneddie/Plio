import {
  SET_IS_CARD_READY,
  SET_FILTERED_STANDARDS,
  SET_IS_FULL_SCREEN_MODE,
  SET_STANDARD_DEPS_READY,
  SET_STANDARDS_INITIALIZING,
} from './types';

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

export function setIsFullScreenMode(isFullScreenMode) {
  return {
    payload: { isFullScreenMode },
    type: SET_IS_FULL_SCREEN_MODE,
  };
}

export function setDepsReady(areDepsReady) {
  return {
    payload: { areDepsReady },
    type: SET_STANDARD_DEPS_READY,
  };
}

export function setInitializing(initializing) {
  return {
    type: SET_STANDARDS_INITIALIZING,
    payload: { initializing },
  };
}
