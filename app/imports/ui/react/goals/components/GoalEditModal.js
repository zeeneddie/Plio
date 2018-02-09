import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle, Button } from 'reactstrap';
import { onlyUpdateForKeys } from 'recompose';

import {
  ErrorSection,
  Modal,
  ModalHeader,
  ModalBody,
  CardBlock,
  SaveButton,
  TextAlign,
} from '../../components';
import GoalEditContainer from '../containers/GoalEditContainer';

const enhance = onlyUpdateForKeys([
  'isOpen',
  'toggle',
  'onClosed',
  'goal',
  'organizationId',
  'loading',
  'error',
  'onDelete',
]);

export const GoalEditModal = ({
  isOpen,
  toggle,
  onClosed,
  goal,
  organizationId,
  loading,
  error,
  onDelete,
}) => (
  <Modal {...{ isOpen, toggle, onClosed }}>
    <ModalHeader
      renderRightButton={() => (
        <SaveButton onClick={toggle} isSaving={loading}>
          Close
        </SaveButton>
      )}
    >
      <CardTitle>Key Goal</CardTitle>
    </ModalHeader>
    <ModalBody>
      <ErrorSection errorText={error && error.message} />

      <div>
        <CardBlock>
          {goal && (
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
  error: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onClosed: PropTypes.func,
  goal: PropTypes.object,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default enhance(GoalEditModal);
