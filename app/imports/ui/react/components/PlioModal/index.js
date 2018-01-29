import PropTypes from 'prop-types';
import React from 'react';
import { Modal as ReactstrapModal } from 'reactstrap';
import cx from 'classnames';

import { TransitionBaseActiveClass, TransitionTimeouts } from '../../../../api/constants';

const Modal = ({
  isOpen,
  toggle,
  className,
  children,
  contentClassName,
  modalTransition,
  backdropTransition,
  ...props
}) => (
  <ReactstrapModal
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
    {...{ isOpen, toggle, ...props }}
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
};

export { default as ModalHeader } from './Header';

export default Modal;
