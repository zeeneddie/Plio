import { SET_IS_HELP_CARD_READY } from './types';

export const setIsHelpCardReady = (isHelpCardReady) => {
  return {
    type: SET_IS_HELP_CARD_READY,
    payload: { isHelpCardReady },
  };
};
