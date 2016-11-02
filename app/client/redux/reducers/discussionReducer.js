import {
  SET_MESSAGES,
  SET_LOADING,
  SET_SORT,
  SET_AT,
  RESET,
  SET_LAST_MESSAGE_ID,
  SET_PRIOR_LIMIT,
  SET_FOLLOWING_LIMIT,
  SET_RESET_COMPLETED,
  SET_DISCUSSION
} from '../actions/types';

export const initialState = {
  discusssion: null,
  messages: [],
  loading: false,
  sort: { createdAt: -1 },
  at: null,
  lastMessageId: null,
  priorLimit: 50,
  followingLimit: 50,
  resetCompleted: false
};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case SET_DISCUSSION:
      return { ...state, discussion: action.payload };
      break;
    case SET_MESSAGES:
      return { ...state, messages: action.payload };
      break;
    case SET_LOADING:
      return { ...state, loading: action.payload };
      break;
    case SET_PRIOR_LIMIT:
      return { ...state, priorLimit: action.payload };
      break;
    case SET_FOLLOWING_LIMIT:
      return { ...state, followingLimit: action.payload };
      break;
    case SET_SORT:
      return { ...state, sort: action.payload };
      break;
    case SET_AT:
      return { ...state, at: action.payload };
      break;
    case SET_LAST_MESSAGE_ID:
      return { ...state, lastMessageId: action.payload };
      break;
    case SET_RESET_COMPLETED:
      return { ...state, resetCompleted: action.payload };
      break;
    case RESET:
      return { ...state, ...action.payload };
      break;
    default:
      return state;
      break;
  }
}
