import PropTypes from 'prop-types';
import React from 'react';
import { ModalBody, CardTitle } from 'reactstrap';

import {
  ErrorSection,
  Modal,
  ModalHeader,
  CardBlock,
  SaveButton,
  PreloaderPage,
} from '../../components';
import GoalEditContainer from '../containers/GoalEditContainer';

export const GoalEditModal = ({
  isOpen,
  toggle,
  errorText,
  isSaving,
  onClosed,
  goal,
  organizationId,
  loading,
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
          {loading ? (
            <PreloaderPage size={2} />
          ) : goal && (
            <GoalEditContainer {...{ goal, organizationId }} />
          )}
        </CardBlock>
      </div>
    </ModalBody>
  </Modal>
);

GoalEditModal.propTypes = {
  loading: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  errorText: PropTypes.string,
  onClosed: PropTypes.func,
  goal: PropTypes.object,
  organizationId: PropTypes.string.isRequired,
};

export default GoalEditModal;
