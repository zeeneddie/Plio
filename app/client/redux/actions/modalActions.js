import React from 'react';
import ReactDOM from 'react-dom';
import { batchActions } from 'redux-batched-actions';

import ModalWindow from '/imports/ui/react/components/ModalWindow';
import {
  SET_MODAL,
  SET_MODAL_SAVING,
  SET_MODAL_ERROR_TEXT,
} from './types';

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
  };
}

export const open = props => () =>
  ReactDOM.render(<ModalWindow {...props} />, document.getElementById('modal'));

export const close = () => (dispatch, getState) => {
  const { modal } = getState().modal.modal;

  return modal && modal.modal('hide');
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
