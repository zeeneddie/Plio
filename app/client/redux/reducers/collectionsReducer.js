import {
  SET_DEPARTMENTS,
  SET_FILES,
  SET_NCS,
  SET_RISKS,
  SET_ACTIONS,
} from '../actions/types';

const initialState = {
  departments: [],
  files: [],
  ncs: [],
  risks: [],
  actions: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DEPARTMENTS:
    case SET_FILES:
    case SET_NCS:
    case SET_RISKS:
    case SET_ACTIONS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
