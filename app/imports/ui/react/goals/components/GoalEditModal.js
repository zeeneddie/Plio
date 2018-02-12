import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle, Button } from 'reactstrap';
import { onlyUpdateForKeys } from 'recompose';

import {
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
  onDelete,
}) => (
  <Modal {...{ isOpen, toggle, onClosed }}>
    <ModalHeader
      renderRightButton={({ loading }) => (
        <SaveButton onClick={toggle} isSaving={loading}>
          Close
        </SaveButton>
      )}
    >
      <CardTitle>Key Goal</CardTitle>
    </ModalHeader>
    <ModalBody>
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
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onClosed: PropTypes.func,
  goal: PropTypes.object,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default enhance(GoalEditModal);
