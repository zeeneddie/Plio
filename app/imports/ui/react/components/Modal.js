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
      dispatch(setError(err.message || 'Internal server error'));
      return err;
    });
};

const enhance = compose(
  connectUI({
    state: {
      '@@modal/loading': false,
      '@@modal/error': null,
    },
    reducer: (state, action) => {
      switch (action.type) {
        case LOADING:
          return state.set('@@modal/loading', true);
        case ERROR:
          return state.set('@@modal/loading', false).set('@@modal/error', action.payload);
        case SUCCESS:
          return state.set('@@modal/loading', false).set('@@modal/error', null);
        default:
          return state;
      }
    },
  }),
  mapProps(({
    ui: {
      '@@modal/error': error,
      '@@modal/loading': loading,
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
    ...props
  }) => ({
    ...props,
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
