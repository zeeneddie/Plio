import {
  SET_WINDOW_WIDTH,
} from './types';

export function setWindowWidth(width) {
  return {
    type: SET_WINDOW_WIDTH,
    payload: { width },
  };
}
