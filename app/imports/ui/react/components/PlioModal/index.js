import PropTypes from 'prop-types';
import React from 'react';
import { Modal as ReactstrapModal } from 'reactstrap';
import cx from 'classnames';

const Modal = ({
  isOpen,
  toggle,
  className,
  children,
  modalClassName,
  contentClassName,
  ...props
}) => (
  <ReactstrapModal
    className={cx('content-cards', className)}
    modalClassName={cx({ in: isOpen }, modalClassName)}
    contentClassName={cx('card', contentClassName)}
    {...{ isOpen, toggle, ...props }}
  >
    {children}
  </ReactstrapModal>
);

Modal.propTypes = {};

export { default as ModalHeader } from './Header';

export default Modal;
