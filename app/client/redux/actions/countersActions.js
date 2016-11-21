import {
  SET_STANDARD_MESSAGES_NOT_VIEWED_COUNT_MAP,
} from './types';

export function setStandardMessagesNotViewedCountMap(standardMessagesNotViewedCountMap) {
  return {
    type: SET_STANDARD_MESSAGES_NOT_VIEWED_COUNT_MAP,
    payload: { standardMessagesNotViewedCountMap },
  };
}
