import {
  SET_DEPARTMENTS,
  SET_FILES,
  SET_NCS,
  SET_RISKS,
  SET_ACTIONS,
  SET_WORK_ITEMS,
  SET_STANDARD_BOOK_SECTIONS,
  SET_STANDARD_TYPES,
  SET_LESSONS_LEARNED,
  SET_STANDARDS,
  ADD_STANDARD,
  UPDATE_STANDARD,
  REMOVE_STANDARD,
} from '../actions/types';
import { mapByIndex, propEqId } from '/imports/api/helpers';

const initialState = {
  departments: [],
  files: [],
  ncs: [],
  risks: [],
  actions: [],
  workItems: [],
  standards: [],
  standardBookSections: [],
  standardTypes: [],
  lessons: [],
};

const findIndexById = (_id, array) => array.findIndex(propEqId(_id));

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DEPARTMENTS:
    case SET_FILES:
    case SET_NCS:
    case SET_RISKS:
    case SET_ACTIONS:
    case SET_WORK_ITEMS:
    case SET_STANDARD_BOOK_SECTIONS:
    case SET_STANDARD_TYPES:
    case SET_LESSONS_LEARNED:
    case SET_STANDARDS:
      return { ...state, ...action.payload };
    case ADD_STANDARD:
      return { ...state, standards: state.standards.concat(action.payload) };
    case UPDATE_STANDARD: {
      const index = findIndexById(action.payload._id, state.standards);
      return { ...state, standards: mapByIndex(action.payload, index, state.standards) };
    }
    case REMOVE_STANDARD: {
      const index = findIndexById(action.payload, state.standards);
      return {
        ...state,
        standards: state.standards.slice(0, index)
                                  .concat(state.standards.slice(index + 1)),
      };
    }
    default:
      return state;
  }
}
