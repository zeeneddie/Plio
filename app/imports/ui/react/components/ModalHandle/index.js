import React, { PropTypes } from 'react';
import Portal from 'react-portal';

import ModalWindowContainer from '../../containers/ModalWindowContainer';

const ModalHandle = ({
  closeOnEsc = false,
  closeOnOutsideClick = false,
  openByClickOn,
  children,
  ...props,
}) => (
  <Portal {...{ closeOnEsc, closeOnOutsideClick, openByClickOn }}>
    <ModalWindowContainer {...props}>
      {children}
    </ModalWindowContainer>
  </Portal>
);

ModalHandle.propTypes = {
  closeOnEsc: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  openByClickOn: PropTypes.element.isRequired,
  children: PropTypes.node,
};

export default ModalHandle;