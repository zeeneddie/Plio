import { SET_IS_HELP_CARD_READY } from '../actions/types';

const initialState = {
  isHelpCardReady: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_IS_HELP_CARD_READY:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
