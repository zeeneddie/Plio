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
  SET_HELP_DOCS,
  SET_HELP_SECTIONS,
  ADD_ITEM,
  CHANGE_ITEM,
  REMOVE_ITEM,
} from '../actions/types';
import { addItem, changeItem, removeItem } from '../lib/collectionsHelpers';

const initialState = {
  departments: [],
  files: [],
  ncs: [],
  risks: [],
  actions: [],
  workItems: [],
  standardBookSections: [],
  standardTypes: [],
  lessons: [],
  helpDocs: [],
  helpSections: [],
};

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
    case SET_HELP_DOCS:
    case SET_HELP_SECTIONS:
      return { ...state, ...action.payload };
    case ADD_ITEM:
      return addItem(state, action.payload);
    case CHANGE_ITEM:
      return changeItem(state, action.payload);
    case REMOVE_ITEM:
      return removeItem(state, action.payload);
    default:
      return state;
  }
}
