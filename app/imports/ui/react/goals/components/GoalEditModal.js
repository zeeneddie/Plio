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

export const GoalEditModal = ({
  isOpen,
  toggle,
  errorText,
  isSaving,
  organizationId,
  onClosed,
  ...props
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
      {console.log(props)}
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

GoalEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  errorText: PropTypes.string,
  onClosed: PropTypes.func,
};

export default GoalEditModal;
