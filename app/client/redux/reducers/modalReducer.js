import {
  SET_MODAL,
  SET_MODAL_SAVING,
  SET_MODAL_ERROR_TEXT,
} from '../actions/types';

const initialState = {
  modal: null,
  isSaving: false,
  errorText: '',
};

export default function reducer(state = initialState, action) {
  switch (action) {
    case SET_MODAL:
    case SET_MODAL_SAVING:
    case SET_MODAL_ERROR_TEXT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
