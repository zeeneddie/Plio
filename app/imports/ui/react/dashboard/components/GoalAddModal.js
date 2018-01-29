import PropTypes from 'prop-types';
import React from 'react';
import { ModalBody, CardTitle, Button } from 'reactstrap';

import { ErrorSection, Modal, ModalHeader } from '../../components';

export const GoalAddModal = ({
  isOpen,
  toggle,
  onSave,
  errorText,
}) => (
  <Modal {...{ isOpen, toggle }}>
    <ModalHeader
      renderLeftButton={() => <Button onClick={toggle}>Close</Button>}
      renderRightButton={() => (
        <Button color="primary" onClick={onSave}>
          Save
        </Button>
      )}
    >
      <CardTitle>Key Goal</CardTitle>
    </ModalHeader>
    <ModalBody>
      <ErrorSection {...{ errorText }} />
    </ModalBody>
  </Modal>
);

GoalAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  errorText: PropTypes.string,
};

export default GoalAddModal;
