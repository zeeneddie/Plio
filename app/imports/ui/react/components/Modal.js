import PropTypes from 'prop-types';
import React from 'react';
import { Modal as ReactstrapModal } from 'reactstrap';
import cx from 'classnames';
import connectUI from 'redux-ui';
import { mapProps, compose } from 'recompose';

import { TransitionBaseActiveClass, TransitionTimeouts } from '../../../api/constants';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';

export const SET_MODAL_LOADING = 'SET_MODAL_LOADING';
export const SET_MODAL_ERROR = 'SET_MODAL_ERROR';

const enhance = compose(
  connectUI({
    state: {
      loading: false,
      error: null,
    },
    reducer: (state, action) => {
      switch (action.type) {
        case SET_MODAL_LOADING:
          return state.set('loading', action.payload);
        case SET_MODAL_ERROR:
          return state.set('error', action.payload);
        default:
          return state;
      }
    },
  }),
  mapProps(({
    children,
    ui: { error, loading },
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
