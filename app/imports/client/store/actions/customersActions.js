import {
  SET_CUSTOMERS_INITIALIZING,
  SET_FILTERED_ORGANIZATIONS,
} from './types';

export function setInitializing(initializing) {
  return {
    type: SET_CUSTOMERS_INITIALIZING,
    payload: { initializing },
  };
}

export function setFilteredOrganizations(organizationsFiltered) {
  return {
    type: SET_FILTERED_ORGANIZATIONS,
    payload: { organizationsFiltered },
  };
}
