import {
  SET_DEPARTMENTS,
  SET_FILES,
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
