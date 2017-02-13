import {
  SET_DATA_IMPORT_OWN_ORGS,
  SET_DATA_IMPORT_ORGS_LOADING,
  SET_DATA_IMPORT_ORGS_LOADED,
  SET_DATA_IMPORT_ORGS_COLLAPSED,
} from '../actions/types';

const initialState = {
  isLoading: false,
  isLoaded: false,
  ownOrganizations: [],
  areOrgsCollapsed: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DATA_IMPORT_OWN_ORGS:
    case SET_DATA_IMPORT_ORGS_LOADING:
    case SET_DATA_IMPORT_ORGS_LOADED:
    case SET_DATA_IMPORT_ORGS_COLLAPSED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
