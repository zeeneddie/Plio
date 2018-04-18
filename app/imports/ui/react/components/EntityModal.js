import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle, Button } from 'reactstrap';
import {
  Modal,
  ModalHeader,
  ModalBody,
  SaveButton,
} from './';

const EntityModal = ({
  isOpen,
  toggle,
  loading,
  children,
  title,
  formTarget,
  showSubmitBtn,
}) => (
  <Modal {...{ isOpen, toggle }}>
    <ModalHeader
      renderLeftButton={() => showSubmitBtn ? <Button onClick={toggle}>Close</Button> : null}
      renderRightButton={props => (
        <SaveButton
          isSaving={loading || props.loading}
          onClick={!showSubmitBtn ? toggle : undefined}
          color={showSubmitBtn ? 'primary' : 'secondary'}
          form={formTarget}
        >
          {showSubmitBtn ? 'Save' : 'Close'}
        </SaveButton>
      )}
    >
      <CardTitle>{title}</CardTitle>
    </ModalHeader>

    <ModalBody>
      {children}
    </ModalBody>
  </Modal>
);

EntityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  initialValues: PropTypes.object,
  loading: PropTypes.bool,
  showSubmitBtn: PropTypes.bool,
  formTarget: PropTypes.string,
};

export default EntityModal;
