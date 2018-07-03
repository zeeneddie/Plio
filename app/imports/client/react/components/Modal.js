import PropTypes from 'prop-types';
import React from 'react';
import { Modal as ReactstrapModal } from 'reactstrap';
import cx from 'classnames';
import connectUI from 'redux-ui';
import { mapProps, compose } from 'recompose';

import {
  TransitionBaseActiveClass,
  TransitionTimeouts,
} from '../../../api/constants';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import { handleGQError } from '../../../api/handleGQError';

export const LOADING = '@@MODAL/LOADING';
export const ERROR = '@@MODAL/ERROR';
export const SUCCESS = '@@MODAL/SUCCESS';
export const setLoading = () => ({ type: LOADING });
export const setError = payload => ({ type: ERROR, payload });
export const success = () => ({ type: SUCCESS });
export const callAsync = asyncAction => (dispatch) => {
  dispatch(setLoading());

  return dispatch(asyncAction)
    .then((res) => {
      dispatch(success());
      return res;
    })
    .catch((err) => {
      dispatch(setError(handleGQError(err)));
      return err;
    });
};

// TODO: REWRITE THIS COMPONENT WITH NEW CONTEXT API!!!!!!

const enhance = compose(
  connectUI({
    state: {
      [LOADING]: false,
      [ERROR]: null,
    },
    reducer(state = {}, action) {
      switch (action.type) {
        case LOADING:
          return state.set(LOADING, true);
        case ERROR:
          return state.set(LOADING, false).set(ERROR, action.payload);
        case SUCCESS:
          return state.set(LOADING, false).set(ERROR, null);
        default:
          return state;
      }
    },
  }),
  mapProps(({
    ui: {
      [ERROR]: error,
      [LOADING]: loading,
    },
    children,
    updateUI,
    massUpdateUI,
    setDefaultUI,
    mountUI,
    unmountUI,
    uiKey,
    uiPath,
    resetUI,
    onClosed,
    ...props
  }) => ({
    ...props,
    onClosed: (...args) => {
      resetUI();

      return onClosed && onClosed(...args);
    },
    children: React.Children.map(children, (child) => {
      switch (child.type) {
        case ModalHeader:
          return React.cloneElement(child, { loading });
        case ModalBody:
          return React.cloneElement(child, { error });
        default:
          return child;
      }
    }),
  })),
);

export const Modal = ({
  isOpen,
  toggle,
  className,
  children,
  contentClassName,
  modalTransition,
  backdropTransition,
  keyboard = false,
  ...props
}) => (
  <ReactstrapModal
    backdrop="static"
    className={cx('content-cards', className)}
    contentClassName={cx('card', contentClassName)}
    modalTransition={{
      baseClassActive: TransitionBaseActiveClass,
      timeout: TransitionTimeouts.modal,
      ...modalTransition,
    }}
    backdropTransition={{
      baseClassActive: TransitionBaseActiveClass,
      timeout: TransitionTimeouts.modal,
      ...backdropTransition,
    }}
    {...{
      isOpen,
      toggle,
      keyboard,
      ...props,
    }}
  >
    {children}
  </ReactstrapModal>
);

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  contentClassName: PropTypes.string,
  modalTransition: PropTypes.object,
  backdropTransition: PropTypes.object,
  keyboard: PropTypes.bool,
};

export default enhance(Modal);
