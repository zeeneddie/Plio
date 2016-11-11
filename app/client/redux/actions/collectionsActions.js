import {
  SET_DEPARTMENTS,
} from './types';

export function setDepartments(departments) {
  return {
    type: SET_DEPARTMENTS,
    payload: { departments },
  };
}
