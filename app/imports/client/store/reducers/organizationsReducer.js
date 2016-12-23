import {
  SET_ORG,
  SET_ORG_ID,
  SET_ORG_SERIAL_NUMBER,
} from '../actions/types';

const initialState = {
  organization: null,
  organizationId: null,
  orgSerialNumber: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_ORG:
    case SET_ORG_ID:
    case SET_ORG_SERIAL_NUMBER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
