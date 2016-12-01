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
  SET_HELP_DOCS,
  SET_HELP_SECTIONS,
} from './types';

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
