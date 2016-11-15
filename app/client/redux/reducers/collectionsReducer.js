import {
  SET_DEPARTMENTS,
  SET_FILES,
  SET_NCS,
  SET_RISKS,
  SET_ACTIONS,
  SET_WORK_ITEMS,
  SET_LESSONS_LEARNED,
} from '../actions/types';

const initialState = {
  departments: [],
  files: [],
  ncs: [],
  risks: [],
  actions: [],
  workItems: [],
  lessons: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DEPARTMENTS:
    case SET_FILES:
    case SET_NCS:
    case SET_RISKS:
    case SET_ACTIONS:
    case SET_WORK_ITEMS:
    case SET_LESSONS_LEARNED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
