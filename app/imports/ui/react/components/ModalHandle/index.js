import React, { PropTypes } from 'react';
import Portal from 'react-portal';

import Button from '../Buttons/Button';
import ModalWindow from '../ModalWindow';

const ModalHandle = ({
  closeOnEsc = false,
  closeOnOutsideClick = false,
  openByClickOn = (<Button type="primary">Edit</Button>),
  children,
  ...props,
}) => (
  <Portal {...{ closeOnEsc, closeOnOutsideClick, openByClickOn }}>
    <ModalWindow {...props}>
      {children}
    </ModalWindow>
  </Portal>
);

ModalHandle.propTypes = {
  closeOnEsc: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  openByClickOn: PropTypes.node,
  children: PropTypes.node,
};

export default ModalHandle;
