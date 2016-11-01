import {
  SET_ORG,
  SET_ORG_ID,
  SET_ORG_SERIAL_NUMBER
} from '../actions/types';

const initialState = {
  organization: null,
  organizationId: null,
  orgSerialNumber: null
};

export default function reducer(state=initialState, action) {
  switch(action.type) {
    case SET_ORG:
      return { ...state, organization: action.payload };
      break;
    case SET_ORG_ID:
      return { ...state, organizationId: action.payload };
      break;
    case SET_ORG_SERIAL_NUMBER:
      return { ...state, orgSerialNumber: action.payload };
      break;
    default:
      return state;
      break;
  }
}
