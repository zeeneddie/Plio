import {
  SET_MESSAGES,
  SET_DISCUSSION_LOADING,
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
    case SET_MESSAGES:
    case SET_DISCUSSION_LOADING:
    case SET_PRIOR_LIMIT:
    case SET_FOLLOWING_LIMIT:
    case SET_SORT:
    case SET_AT:
    case SET_LAST_MESSAGE_ID:
    case SET_RESET_COMPLETED:
    case SET_IS_DISCUSSION_OPENED:
    case RESET:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
