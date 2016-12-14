import { SET_CUSTOMERS_INITIALIZING } from '../actions/types';

const initialState = {
  initializing: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_CUSTOMERS_INITIALIZING:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
