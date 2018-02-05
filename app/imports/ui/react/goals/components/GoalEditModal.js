import PropTypes from 'prop-types';
import React from 'react';
import { ModalBody, CardTitle } from 'reactstrap';

import {
  ErrorSection,
  Modal,
  ModalHeader,
  CardBlock,
  SaveButton,
} from '../../components';

export const GoalAddModal = ({
  isOpen,
  toggle,
  errorText,
  isSaving,
  organizationId,
  onClosed,
}) => (
  <Modal {...{ isOpen, toggle, onClosed }}>
    <ModalHeader
      renderRightButton={() => (
        <SaveButton onClick={toggle} {...{ isSaving }}>
          Close
        </SaveButton>
      )}
    >
      <CardTitle>Key Goal</CardTitle>
    </ModalHeader>
    <ModalBody>
      <ErrorSection {...{ errorText }} />

      <div>
        <CardBlock>
          Hello World
        </CardBlock>
      </div>
    </ModalBody>
  </Modal>
);

GoalAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  errorText: PropTypes.string,
  organizationId: PropTypes.string.isRequired,
  onClosed: PropTypes.func,
};

export default GoalAddModal;
