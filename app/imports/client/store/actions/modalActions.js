import { Meteor } from 'meteor/meteor';
import { compose } from 'recompose';
import { batchActions } from 'redux-batched-actions';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import swal from '/imports/ui/utils/swal';

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

export const close = (dispatch, getState) => {
  const { modal } = getState().modal;

  return modal && $(modal).modal('hide');
};

const handleMethodResult = (resolve, reject) => (err, res) => (dispatch) => {
  let actions = [setSaving(false)];

  if (err) {
    swal.close();
    reject(err);
    actions = actions.concat(setErrorText(err.reason || 'Internal server error'));
  } else resolve(res);

  dispatch(batchActions(actions));
};

export const callMethod = (method, args) => dispatch => new Promise((resolve, reject) => {
  const methodArgs = [args, compose(dispatch, handleMethodResult(resolve, reject))];

  dispatch(batchActions([
    setErrorText(''),
    setSaving(true),
  ]));

  return _.isString(method)
    ? Meteor.call(method, ...methodArgs)
    : method.call(...methodArgs);
});
