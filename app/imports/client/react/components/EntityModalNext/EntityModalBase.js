import PropTypes from 'prop-types';
import React from 'react';

import { ModalProvider, Modal } from '../Modal';

const EntityModalBase = ({
  isOpen,
  toggle,
  children,
  ...props
}) => (
  <ModalProvider
    {...{ isOpen, toggle }}
  >
    <Modal {...props}>
      {children}
    </Modal>
  </ModalProvider>
);

EntityModalBase.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default EntityModalBase;
