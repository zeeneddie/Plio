import {
  SET_STANDARD_MESSAGES_NOT_VIEWED_COUNT,
} from './types';

export function setStandardMessagesNotViewedCount(standardMessagesNotViewedCount) {
  return {
    type: SET_STANDARD_MESSAGES_NOT_VIEWED_COUNT,
    payload: { standardMessagesNotViewedCount },
  };
}
