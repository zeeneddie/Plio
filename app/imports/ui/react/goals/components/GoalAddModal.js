import PropTypes from 'prop-types';
import React from 'react';
import { ModalBody, CardTitle, Button } from 'reactstrap';

import {
  Modal,
  ModalHeader,
  CardBlock,
  SaveButton,
} from '../../components';
import GoalFormContainer from '../containers/GoalFormContainer';

export const GoalAddModal = ({
  isOpen,
  toggle,
  onSubmit,
  organizationId,
  onClosed,
}) => (
  <Modal {...{ isOpen, toggle, onClosed }}>
    <ModalHeader
      renderLeftButton={() => <Button onClick={toggle}>Close</Button>}
      renderRightButton={({ loading }) => (
        <SaveButton onClick={onSubmit} isSaving={loading} />
      )}
    >
      <CardTitle>Key Goal</CardTitle>
    </ModalHeader>
    <ModalBody>
      <div>
        <CardBlock>
          <GoalFormContainer {...{ organizationId }} />
        </CardBlock>
      </div>
    </ModalBody>
  </Modal>
);

GoalAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  organizationId: PropTypes.string.isRequired,
  onClosed: PropTypes.func,
};

export default GoalAddModal;
