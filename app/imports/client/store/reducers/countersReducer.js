import {
  SET_STANDARD_MESSAGES_NOT_VIEWED_COUNT_MAP,
} from '../actions/types';

const initialState = {
  standardMessagesNotViewedCountMap: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_STANDARD_MESSAGES_NOT_VIEWED_COUNT_MAP:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
