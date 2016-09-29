import {
  SET_MESSAGES,
  SET_LOADING,
  SET_LIMIT,
  SET_SORT,
  SET_AT,
  RESET,
  SET_LAST_MESSAGE_ID,
  SET_SHOULD_SCROLL_TO_BOTTOM,
  SET_PRIOR_LIMIT,
  SET_FOLLOWING_LIMIT,
  SET_INITIAL_DATA_LOADED
} from '../actions/types';

export const initialState = {
  messages: [],
  loading: false,
  isInitialDataLoaded: false,
  limit: 50,
  sort: { createdAt: -1 },
  at: null,
  lastMessageId: null,
  shouldScrollToBotom: false,
  priorLimit: 50,
  followingLimit: 50
};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case SET_MESSAGES:
      return { ...state, messages: action.payload };
      break;
    case SET_LOADING:
      return { ...state, loading: action.payload };
      break;
    case SET_INITIAL_DATA_LOADED:
      return { ...state, isInitialDataLoaded: action.payload };
      break;
    case SET_LIMIT:
      return { ...state, limit: action.payload };
      break;
    case SET_PRIOR_LIMIT:
      return { ...state, priorLimit: action.payload };
      break;
    case SET_FOLLOWING_LIMIT:
      return { ...state, followingLimit: action.payload };
    case SET_SORT:
      return { ...state, sort: action.payload };
      break;
    case SET_AT:
      return { ...state, at: action.payload };
      break;
    case SET_LAST_MESSAGE_ID:
      return { ...state, lastMessageId: action.payload };
      break;
    case SET_SHOULD_SCROLL_TO_BOTTOM:
      return { ...state, shouldScrollToBotom: action.payload };
      break;
      break;
    case RESET:
      return { ...state, ...action.payload };
      break;
    default:
      return state;
      break;
  }
}
