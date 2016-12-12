import {
  SET_IS_CARD_READY,
  SET_FILTERED_STANDARDS,
  SET_IS_FULL_SCREEN_MODE,
  SET_STANDARD_DEPS_READY,
  SET_STANDARDS_INITIALIZING,
} from '../actions/types';

const initialState = {
  standardsFiltered: [],
  isCardReady: false,
  isFullScreenMode: false,
  areDepsReady: false,
  initializing: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_IS_CARD_READY:
    case SET_FILTERED_STANDARDS:
    case SET_IS_FULL_SCREEN_MODE:
    case SET_STANDARD_DEPS_READY:
    case SET_STANDARDS_INITIALIZING:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
