import {
  SET_MOBILE_SHOW_CARD,
} from '../actions/types';

const initialState = {
  showCard: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_MOBILE_SHOW_CARD:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
