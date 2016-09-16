import { SET_MESSAGES, SET_LIMIT, SET_LOADING, SET_SCROLL_DIR } from '../actions/types';

const initialState = {
  messages: [],
  loading: false,
  limit: 50,
  scrollDir: null
};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case SET_MESSAGES:
      return { ...state, messages: action.payload };
      break;
    case SET_LIMIT:
      return { ...state, limit: action.payload };
      break;
    case SET_LOADING:
      return { ...state, loading: action.payload };
      break;
    case SET_SCROLL_DIR:
      return { ...state, scrollDir: action.payload };
      break;
    default:
      return state;
      break;
  }
}
