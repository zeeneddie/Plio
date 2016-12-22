import {
  SET_MOBILE_SHOW_CARD,
} from './types';

export function setShowCard(showCard) {
  return {
    type: SET_MOBILE_SHOW_CARD,
    payload: { showCard },
  };
}
