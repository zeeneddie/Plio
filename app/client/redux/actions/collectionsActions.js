import {
  SET_DEPARTMENTS,
  SET_FILES,
  SET_NCS,
  SET_RISKS,
  SET_ACTIONS,
  SET_WORK_ITEMS,
  SET_STANDARD_BOOK_SECTIONS,
  SET_STANDARD_TYPES,
  SET_STANDARDS,
  SET_LESSONS_LEARNED,
  ADD_STANDARD,
  UPDATE_STANDARD,
  REMOVE_STANDARD,
} from './types';
import { createAction } from './helpers';

export function setDepartments(departments) {
  return {
    type: SET_DEPARTMENTS,
    payload: { departments },
  };
}

export function setFiles(files) {
  return {
    type: SET_FILES,
    payload: { files },
  };
}

export function setNCs(ncs) {
  return {
    type: SET_NCS,
    payload: { ncs },
  };
}

export function setRisks(risks) {
  return {
    type: SET_RISKS,
    payload: { risks },
  };
}

export function setActions(actions) {
  return {
    type: SET_ACTIONS,
    payload: { actions },
  };
}

export function setWorkItems(workItems) {
  return {
    type: SET_WORK_ITEMS,
    payload: { workItems },
  };
}

export function setStandardBookSections(standardBookSections) {
  return {
    type: SET_STANDARD_BOOK_SECTIONS,
    payload: { standardBookSections },
  };
}

export function setStandardTypes(standardTypes) {
  return {
    type: SET_STANDARD_TYPES,
    payload: { standardTypes },
  };
}

export function setStandards(standards) {
  return {
    type: SET_STANDARDS,
    payload: { standards },
  };
}

export function setLessons(lessons) {
  return {
    type: SET_LESSONS_LEARNED,
    payload: { lessons },
  };
}

export const addStandard = createAction(ADD_STANDARD);

export const updateStandard = createAction(UPDATE_STANDARD);

export const removeStandard = createAction(REMOVE_STANDARD);
