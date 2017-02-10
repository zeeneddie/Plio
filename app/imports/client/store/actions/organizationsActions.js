import {
  SET_ORG,
  SET_ORG_ID,
  SET_ORG_SERIAL_NUMBER,
  ORGANIZATION_CHANGED,
} from './types';

export const organizationChanged = { type: ORGANIZATION_CHANGED };

export function setOrg(organization) {
  return {
    payload: { organization },
    type: SET_ORG,
  };
}

export function setOrgId(organizationId) {
  return {
    payload: { organizationId },
    type: SET_ORG_ID,
  };
}

export function setOrgSerialNumber(orgSerialNumber) {
  return {
    payload: { orgSerialNumber },
    type: SET_ORG_SERIAL_NUMBER,
  };
}
