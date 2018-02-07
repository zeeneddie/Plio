import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle, Button } from 'reactstrap';

import {
  ErrorSection,
  Modal,
  ModalHeader,
  ModalBody,
  CardBlock,
  SaveButton,
  PreloaderPage,
  TextAlign,
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
  onDelete,
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
        <TextAlign center>
          <CardBlock>
            <Button onClick={onDelete}>
              Delete
            </Button>
          </CardBlock>
        </TextAlign>
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
  onDelete: PropTypes.func.isRequired,
};

export default GoalEditModal;
