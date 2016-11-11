import {
  SET_DEPARTMENTS,
} from '../actions/types';

const initialState = {
  departments: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DEPARTMENTS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
