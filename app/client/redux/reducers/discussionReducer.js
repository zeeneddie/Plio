import {
  SET_MESSAGES,
  SET_LOADING,
  SET_LIMIT,
  SET_SORT,
  SET_AT,
  RESET
} from '../actions/types';

export const initialState = {
  messages: [],
  loading: false,
  limit: 50,
  sort: { createdAt: -1 },
  at: null
};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case SET_MESSAGES:
      return { ...state, messages: action.payload };
      break;
    case SET_LOADING:
      return { ...state, loading: action.payload };
      break;
    case SET_LIMIT:
      return { ...state, limit: action.payload };
      break;
    case SET_SORT:
      return { ...state, sort: action.payload };
      break;
    case SET_AT:
      return { ...state, at: action.payload };
      break;
    case RESET:
      return { ...state, ...action.payload };
      break;
    default:
      return state;
      break;
  }
}
