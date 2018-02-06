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
import GoalEditContainer from '../containers/GoalEditContainer';

export const GoalEditModal = ({
  isOpen,
  toggle,
  errorText,
  isSaving,
  organizationId,
  onClosed,
  goal,
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
          <GoalEditContainer {...{ organizationId, goal }} />
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
  organizationId: PropTypes.string.isRequired,
  goal: PropTypes.object.isRequired,
};

export default GoalEditModal;
