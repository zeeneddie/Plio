import {
  SET_STANDARD_MESSAGES_NOT_VIEWED_COUNT,
} from '../actions/types';

const initialState = {
  standardMessagesNotViewedCount: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_STANDARD_MESSAGES_NOT_VIEWED_COUNT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
