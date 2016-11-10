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
  SET_DISCUSSION,
  SET_IS_DISCUSSION_OPENED,
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
  resetCompleted: false,
  isDiscussionOpened: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DISCUSSION:
      return { ...state, discussion: action.payload };
    case SET_MESSAGES:
      return { ...state, messages: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_PRIOR_LIMIT:
      return { ...state, priorLimit: action.payload };
    case SET_FOLLOWING_LIMIT:
      return { ...state, followingLimit: action.payload };
    case SET_SORT:
      return { ...state, sort: action.payload };
    case SET_AT:
      return { ...state, at: action.payload };
    case SET_LAST_MESSAGE_ID:
      return { ...state, lastMessageId: action.payload };
    case SET_RESET_COMPLETED:
      return { ...state, resetCompleted: action.payload };
    case SET_IS_DISCUSSION_OPENED:
      return { ...state, isDiscussionOpened: action.payload };
    case RESET:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
