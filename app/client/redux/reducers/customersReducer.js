import {
  SET_CUSTOMERS_INITIALIZING,
  SET_FILTERED_ORGANIZATIONS,
} from '../actions/types';

const initialState = {
  initializing: true,
  organizationsFiltered: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_CUSTOMERS_INITIALIZING:
    case SET_FILTERED_ORGANIZATIONS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
