import {
  SET_MODAL,
  SET_MODAL_SAVING,
  SET_MODAL_ERROR_TEXT,
  ON_MODAL_CLOSE,
} from '../actions/types';

const initialState = {
  modal: null,
  isSaving: false,
  errorText: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_MODAL:
    case SET_MODAL_SAVING:
    case SET_MODAL_ERROR_TEXT:
      return { ...state, ...action.payload };
    case ON_MODAL_CLOSE:
      return initialState;
    default:
      return state;
  }
}
