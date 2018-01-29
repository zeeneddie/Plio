import PropTypes from 'prop-types';
import React from 'react';
import { ModalBody, CardTitle, Button } from 'reactstrap';

import {
  ErrorSection,
  Modal,
  ModalHeader,
  CardBlock,
} from '../../components';
import GoalForm from './GoalForm';

export const GoalAddModal = ({
  isOpen,
  toggle,
  errorText,
  onSubmit,
}) => (
  <Modal {...{ isOpen, toggle }}>
    <ModalHeader
      renderLeftButton={() => <Button onClick={toggle}>Close</Button>}
      renderRightButton={() => (
        <Button color="primary" onClick={onSubmit}>
          Save
        </Button>
      )}
    >
      <CardTitle>Key Goal</CardTitle>
    </ModalHeader>
    <ModalBody>
      <ErrorSection {...{ errorText }} />

      <div>
        <CardBlock>
          <GoalForm />
        </CardBlock>
      </div>
    </ModalBody>
  </Modal>
);

GoalAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  errorText: PropTypes.string,
};

export default GoalAddModal;
