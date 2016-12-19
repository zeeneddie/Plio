import { batchActions } from 'redux-batched-actions';
import { $ } from 'meteor/jquery';

import {
  SET_MODAL,
  SET_MODAL_SAVING,
  SET_MODAL_ERROR_TEXT,
  ON_MODAL_CLOSE,
} from './types';

export const onModalClose = { type: ON_MODAL_CLOSE };

export function setModal(modal) {
  return {
    type: SET_MODAL,
    payload: { modal },
  };
}

export function setSaving(isSaving) {
  return {
    type: SET_MODAL_SAVING,
    payload: { isSaving },
  };
}

export function setErrorText(errorText) {
  return {
    type: SET_MODAL_ERROR_TEXT,
    payload: { errorText },
    throttle: 400,
  };
}

export const close = () => (dispatch, getState) => {
  const { modal } = getState().modal.modal;

  return modal && $(modal).modal('hide');
};

export const setError = errorText => dispatch =>
  dispatch(setErrorText(errorText));

export const callMethod = (method, args, cb) => (dispatch) => {
  if (typeof args === 'function') {
    cb = args;
    args = {};
  }

  dispatch(batchActions([
    setErrorText(''),
    setSaving(true),
  ]));

  const handleMethodResult = (callback) => (err, res) => {
    // if callback returns true, doesn't perform default actions
    if (typeof callback === 'function' && callback(err, res)) return;

    let actions = [setSaving(false)];

    if (err) actions = actions.concat(setErrorText(err.reason || 'Internal server error'));

    dispatch(batchActions(actions));
  };

  method.call(args, handleMethodResult(cb));
};
