import { SET_MESSAGES, SET_LIMIT } from '../actions/types';

const initialState = {
  loading: false,
  limit: 50,
  messages: []
};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case SET_MESSAGES:
      return { ...state, messages: action.payload };
      break;
    case SET_LIMIT:
      return { ...state, limit: action.payload };
      break;
    default:
      return state;
      break;
  }
}
