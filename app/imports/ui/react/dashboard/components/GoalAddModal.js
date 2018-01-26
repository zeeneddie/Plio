import PropTypes from 'prop-types';
import React from 'react';
import { ModalBody, CardTitle, Button } from 'reactstrap';

import Modal, { ModalHeader } from '../../components/PlioModal';
import { ErrorSection } from '../../components';

const GoalAddModal = ({
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

GoalAddModal.propTypes = {};

export default GoalAddModal;
