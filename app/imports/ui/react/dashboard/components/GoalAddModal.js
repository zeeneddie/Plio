import PropTypes from 'prop-types';
import React from 'react';
import { ModalBody, CardTitle, Button } from 'reactstrap';

import Modal, { ModalHeader } from '../../components/PlioModal';

const GoalAddModal = ({ isOpen, toggle, onSave }) => (
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
    <ModalBody>Hello</ModalBody>
  </Modal>
);

GoalAddModal.propTypes = {};

export default GoalAddModal;
