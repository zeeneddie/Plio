import {
  SET_DEPARTMENTS,
  SET_FILES,
} from '../actions/types';

const initialState = {
  departments: [],
  files: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DEPARTMENTS:
    case SET_FILES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
