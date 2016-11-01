import {
  SET_ORG,
  SET_ORG_ID,
  SET_ORG_SERIAL_NUMBER
} from './types';

export function setOrg(payload) {
  return {
    payload,
    type: SET_ORG
  }
}

export function setOrgId(payload) {
  return {
    payload,
    type: SET_ORG_ID
  }
}

export function setOrgSerialNumber(payload) {
  return {
    payload,
    type: SET_ORG_SERIAL_NUMBER
  }
}
