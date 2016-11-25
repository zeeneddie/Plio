import {
  SET_WINDOW_WIDTH,
} from '../actions/types';

const initialState = {
  width: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_WINDOW_WIDTH:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
