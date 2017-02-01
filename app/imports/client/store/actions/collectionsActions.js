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
  SET_ORGANIZATIONS,
  ADD_STANDARD,
  UPDATE_STANDARD,
  REMOVE_STANDARD,
  ADD_STANDARD_BOOK_SECTION,
  UPDATE_STANDARD_BOOK_SECTION,
  REMOVE_STANDARD_BOOK_SECTION,
  ADD_STANDARD_TYPE,
  UPDATE_STANDARD_TYPE,
  REMOVE_STANDARD_TYPE,
  ADD_ORGANIZATION,
  UPDATE_ORGANIZATION,
  REMOVE_ORGANIZATION,
  SET_HELP_DOCS,
  SET_HELP_SECTIONS,
  SET_USERS,
  SET_USERS_BY_ORG_IDS,
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

export function setOrganizations(organizations) {
  return {
    type: SET_ORGANIZATIONS,
    payload: { organizations },
  };
}

export function setHelpDocs(helpDocs) {
  return {
    type: SET_HELP_DOCS,
    payload: { helpDocs },
  };
}

export function setHelpSections(helpSections) {
  return {
    type: SET_HELP_SECTIONS,
    payload: { helpSections },
  };
}

export function setUsers(users) {
  return {
    type: SET_USERS,
    payload: { users },
  };
}

export const setUsersByOrgIds = createAction(SET_USERS_BY_ORG_IDS);

export const addStandard = createAction(ADD_STANDARD);

export const updateStandard = createAction(UPDATE_STANDARD);

export const removeStandard = createAction(REMOVE_STANDARD);

export const addStandardBookSection = createAction(ADD_STANDARD_BOOK_SECTION);

export const updateStandardBookSection = createAction(UPDATE_STANDARD_BOOK_SECTION);

export const removeStandardBookSection = createAction(REMOVE_STANDARD_BOOK_SECTION);

export const addStandardType = createAction(ADD_STANDARD_TYPE);

export const updateStandardType = createAction(UPDATE_STANDARD_TYPE);

export const removeStandardType = createAction(REMOVE_STANDARD_TYPE);

export const addOrganization = createAction(ADD_ORGANIZATION);

export const updateOrganization = createAction(UPDATE_ORGANIZATION);

export const removeOrganization = createAction(REMOVE_ORGANIZATION);
