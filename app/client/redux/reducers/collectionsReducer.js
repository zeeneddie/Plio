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
  ADD_STANDARD_BOOK_SECTION,
  UPDATE_STANDARD_BOOK_SECTION,
  REMOVE_STANDARD_BOOK_SECTION,
  ADD_STANDARD_TYPE,
  UPDATE_STANDARD_TYPE,
  REMOVE_STANDARD_TYPE,
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
  const add = (prop) => ({ ...state, [prop]: state[prop].concat(action.payload) });
  const update = (prop) => {
    const index = findIndexById(action.payload._id, state[prop]);
    return { ...state, [prop]: mapByIndex(action.payload, index, state[prop]) };
  };
  const remove = (prop) => {
    const index = findIndexById(action.payload, state[prop]);
    return {
      ...state,
      [prop]: state[prop].slice(0, index)
                                .concat(state[prop].slice(index + 1)),
    };
  };

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
      return add('standards');
    case UPDATE_STANDARD:
      return update('standards');
    case REMOVE_STANDARD:
      return remove('standards');
    case ADD_STANDARD_BOOK_SECTION:
      return add('standardBookSections');
    case UPDATE_STANDARD_BOOK_SECTION:
      return update('standardBookSections');
    case REMOVE_STANDARD_BOOK_SECTION:
      return remove('standardBookSections');
    case ADD_STANDARD_TYPE:
      return add('standardTypes');
    case UPDATE_STANDARD_TYPE:
      return update('standardTypes');
    case REMOVE_STANDARD_TYPE:
      return remove('standardTypes');
    default:
      return state;
  }
}
